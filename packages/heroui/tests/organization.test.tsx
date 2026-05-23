import { QueryClient } from "@tanstack/react-query"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { AuthProvider } from "../src/components/auth/auth-provider"
import { SlugField } from "../src/components/auth/organization/slug-field"
import { organizationPlugin } from "../src/lib/auth/organization-plugin"

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
}

const DEBOUNCE_TIMEOUT = 2500

async function sleep(ms: number) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  })
}

function createSlugFieldAuthClient(
  impl: (params: {
    slug: string
  }) => Promise<{ status: boolean }> = async () => ({ status: true })
) {
  const checkSlug = vi.fn(impl)
  return {
    organization: { checkSlug },
    useSession: () => ({ data: null, isPending: false, error: null })
  } as unknown as Parameters<typeof AuthProvider>[0]["authClient"] & {
    organization: { checkSlug: typeof checkSlug }
  }
}

function ControlledSlugField({
  initialValue = "",
  currentSlug
}: {
  initialValue?: string
  currentSlug?: string
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <SlugField value={value} onChange={setValue} currentSlug={currentSlug} />
  )
}

function renderSlugField(
  options: {
    authClient?: ReturnType<typeof createSlugFieldAuthClient>
    pluginOptions?: Parameters<typeof organizationPlugin>[0]
    initialValue?: string
    currentSlug?: string
  } = {}
) {
  const authClient = options.authClient ?? createSlugFieldAuthClient()
  const { container } = render(
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin(options.pluginOptions)]}
      queryClient={createTestQueryClient()}
    >
      <ControlledSlugField
        initialValue={options.initialValue}
        currentSlug={options.currentSlug}
      />
    </AuthProvider>
  )
  return { authClient, container }
}

describe("<SlugField />", () => {
  it("renders no availability indicator before any input", () => {
    const { container } = renderSlugField()

    expect(container.querySelector(".text-success")).not.toBeInTheDocument()
    expect(container.querySelector(".text-danger")).not.toBeInTheDocument()
  })

  it("shows the check icon after typing a free slug", async () => {
    const user = userEvent.setup()
    const { authClient, container } = renderSlugField({
      authClient: createSlugFieldAuthClient(async () => ({ status: true }))
    })

    await user.type(screen.getByLabelText("Slug"), "my-org")

    await waitFor(
      () => {
        expect(authClient.organization.checkSlug).toHaveBeenCalledTimes(1)
      },
      { timeout: DEBOUNCE_TIMEOUT }
    )

    expect(authClient.organization.checkSlug).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "my-org",
        fetchOptions: expect.objectContaining({ throw: true })
      })
    )

    await waitFor(() => {
      expect(container.querySelector(".text-success")).toBeInTheDocument()
    })
  })

  it("shows the X icon when the slug is unavailable", async () => {
    const user = userEvent.setup()
    const { container } = renderSlugField({
      authClient: createSlugFieldAuthClient(async () => {
        throw new Error("ORGANIZATION_SLUG_ALREADY_TAKEN")
      })
    })

    await user.type(screen.getByLabelText("Slug"), "taken")

    await waitFor(
      () => {
        expect(container.querySelector(".text-danger")).toBeInTheDocument()
      },
      { timeout: DEBOUNCE_TIMEOUT }
    )
  })

  it("does not call checkSlug when checkSlug is disabled", async () => {
    const user = userEvent.setup()
    const { authClient, container } = renderSlugField({
      pluginOptions: { checkSlug: false }
    })

    await user.type(screen.getByLabelText("Slug"), "my-org")
    await sleep(700)

    expect(authClient.organization.checkSlug).not.toHaveBeenCalled()
    expect(container.querySelector(".text-success")).not.toBeInTheDocument()
  })

  it("skips the availability check when the value matches currentSlug", async () => {
    const { authClient } = renderSlugField({
      currentSlug: "my-org",
      initialValue: "my-org"
    })

    await sleep(700)

    expect(authClient.organization.checkSlug).not.toHaveBeenCalled()
  })
})
