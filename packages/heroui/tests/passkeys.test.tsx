import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AuthProvider } from "../src/components/auth/auth-provider"
import { PasskeyButton } from "../src/components/passkey/passkey-button"
import { Passkeys } from "../src/components/passkey/passkeys"
import { passkeyPlugin } from "../src/lib/passkey/passkey-plugin"

// ---------------------------------------------------------------------------
// <PasskeyButton />
// ---------------------------------------------------------------------------

/**
 * Minimal `authClient` shape required by `<PasskeyButton>`. We only need
 * `signIn.passkey` — the only better-auth API the component touches.
 */
function createPasskeyButtonAuthClient() {
  const passkey = vi.fn(async () => ({ data: {}, error: null }))

  return {
    signIn: { passkey },
    useSession: () => ({ data: null, isPending: false, error: null })
  } as unknown as Parameters<typeof AuthProvider>[0]["authClient"] & {
    signIn: { passkey: typeof passkey }
  }
}

function renderPasskeyButton(authClient = createPasskeyButtonAuthClient()) {
  return {
    authClient,
    ...render(
      <AuthProvider
        authClient={authClient}
        navigate={() => {}}
        plugins={[passkeyPlugin()]}
      >
        <PasskeyButton />
      </AuthProvider>
    )
  }
}

describe("<PasskeyButton />", () => {
  it("renders a 'Continue with Passkey' button", () => {
    renderPasskeyButton()
    expect(
      screen.getByRole("button", { name: /continue with passkey/i })
    ).toBeInTheDocument()
  })

  it("calls authClient.signIn.passkey on click", async () => {
    const user = userEvent.setup()
    const { authClient } = renderPasskeyButton()

    await user.click(
      screen.getByRole("button", { name: /continue with passkey/i })
    )

    await waitFor(() => {
      expect(authClient.signIn.passkey).toHaveBeenCalledTimes(1)
    })

    expect(authClient.signIn.passkey).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchOptions: expect.objectContaining({ throw: true })
      })
    )
  })

  it("does not render on the signUp view", () => {
    const { container } = render(
      <AuthProvider
        authClient={createPasskeyButtonAuthClient()}
        navigate={() => {}}
        plugins={[passkeyPlugin()]}
      >
        <PasskeyButton view="signUp" />
      </AuthProvider>
    )
    expect(container).toBeEmptyDOMElement()
  })
})

// ---------------------------------------------------------------------------
// <Passkeys />
// ---------------------------------------------------------------------------

/**
 * Minimal `authClient` shape required by `<Passkeys>`. Needs
 * `passkey.listUserPasskeys`, `passkey.addPasskey`, and `passkey.deletePasskey`.
 */
function createPasskeysAuthClient(
  passkeys: { id: string; name: string | null; createdAt: Date }[] = []
) {
  const listUserPasskeys = vi.fn(async () => ({ data: passkeys, error: null }))
  const addPasskey = vi.fn(async () => ({
    data: { id: "new", name: null, createdAt: new Date() },
    error: null
  }))
  const deletePasskey = vi.fn(async () => ({ data: {}, error: null }))

  return {
    passkey: { listUserPasskeys, addPasskey, deletePasskey },
    useSession: () => ({
      data: { user: { id: "user-1" } },
      isPending: false,
      error: null
    })
  } as unknown as Parameters<typeof AuthProvider>[0]["authClient"] & {
    passkey: {
      listUserPasskeys: typeof listUserPasskeys
      addPasskey: typeof addPasskey
      deletePasskey: typeof deletePasskey
    }
  }
}

function renderPasskeys(authClient = createPasskeysAuthClient()) {
  return {
    authClient,
    ...render(
      <AuthProvider
        authClient={authClient}
        navigate={() => {}}
        plugins={[passkeyPlugin()]}
      >
        <Passkeys />
      </AuthProvider>
    )
  }
}

describe("<Passkeys />", () => {
  it("renders the section heading and description", async () => {
    renderPasskeys()

    await waitFor(() => {
      expect(screen.getByText(/^passkeys$/i)).toBeInTheDocument()
      expect(
        screen.getByText(/manage your passkeys for secure access/i)
      ).toBeInTheDocument()
    })
  })

  it("renders an 'Add passkey' button", async () => {
    renderPasskeys()
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add passkey/i })
      ).toBeInTheDocument()
    })
  })

  it("calls addPasskey when the add button is clicked", async () => {
    const user = userEvent.setup()
    const { authClient } = renderPasskeys()

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add passkey/i })
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /add passkey/i }))

    await waitFor(() => {
      expect(authClient.passkey.addPasskey).toHaveBeenCalledTimes(1)
    })

    expect(authClient.passkey.addPasskey).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchOptions: expect.objectContaining({ throw: true })
      })
    )
  })

  it("renders registered passkeys", async () => {
    const authClient = createPasskeysAuthClient([
      { id: "pk-1", name: "My MacBook", createdAt: new Date("2024-01-01") },
      { id: "pk-2", name: null, createdAt: new Date("2024-06-01") }
    ])
    renderPasskeys(authClient)

    await waitFor(() => {
      expect(screen.getByText("My MacBook")).toBeInTheDocument()
      // null name falls back to the "Passkey" localization string
      expect(screen.getByText("Passkey")).toBeInTheDocument()
    })
  })

  it("calls deletePasskey with the correct id", async () => {
    const user = userEvent.setup()
    const authClient = createPasskeysAuthClient([
      { id: "pk-1", name: "My MacBook", createdAt: new Date("2024-01-01") }
    ])
    renderPasskeys(authClient)

    await waitFor(() => {
      expect(screen.getByText("My MacBook")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /delete/i }))

    await waitFor(() => {
      expect(authClient.passkey.deletePasskey).toHaveBeenCalledTimes(1)
    })

    expect(authClient.passkey.deletePasskey).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "pk-1",
        fetchOptions: expect.objectContaining({ throw: true })
      })
    )
  })
})
