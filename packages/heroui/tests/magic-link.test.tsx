import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AuthProvider } from "../src/components/auth/auth-provider"
import { MagicLink } from "../src/components/auth/magic-link/magic-link"
import { magicLinkPlugin } from "../src/lib/auth/magic-link-plugin"

/**
 * Minimal `authClient` shape required by `<MagicLink>`. We only need
 * `signIn.magicLink` — the only better-auth API the component touches.
 */
function createMockAuthClient(
  impl: (params: {
    email: string
    callbackURL?: string
  }) => Promise<unknown> = async () => ({ data: {}, error: null })
) {
  const magicLink = vi.fn(impl)

  return {
    signIn: { magicLink },
    // Other surfaces the provider type expects but our component never reads.
    useSession: () => ({ data: null, isPending: false, error: null })
  } as unknown as Parameters<typeof AuthProvider>[0]["authClient"] & {
    signIn: { magicLink: typeof magicLink }
  }
}

function renderMagicLink(authClient = createMockAuthClient()) {
  return {
    authClient,
    ...render(
      <AuthProvider
        authClient={authClient}
        navigate={() => {}}
        plugins={[magicLinkPlugin()]}
      >
        <MagicLink />
      </AuthProvider>
    )
  }
}

describe("<MagicLink />", () => {
  it("calls authClient.signIn.magicLink with the entered email", async () => {
    const user = userEvent.setup()
    const { authClient } = renderMagicLink()

    await user.type(screen.getByLabelText(/email/i), "user@example.com")
    await user.click(screen.getByRole("button", { name: /send magic link/i }))

    await waitFor(() => {
      expect(authClient.signIn.magicLink).toHaveBeenCalledTimes(1)
    })

    expect(authClient.signIn.magicLink).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "user@example.com",
        fetchOptions: expect.objectContaining({ throw: true })
      })
    )
  })

  it("clears the email input on a successful send", async () => {
    const user = userEvent.setup()
    renderMagicLink()

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    await user.type(emailInput, "user@example.com")
    expect(emailInput.value).toBe("user@example.com")

    await user.click(screen.getByRole("button", { name: /send magic link/i }))

    await waitFor(() => {
      expect(emailInput.value).toBe("")
    })
  })
})
