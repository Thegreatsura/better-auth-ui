import {
  type PasskeyAuthClient,
  useAuth,
  useAuthPlugin,
  useSignInPasskey
} from "@better-auth-ui/react"
import { Fingerprint } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"

export type PasskeyButtonProps = {
  isPending?: boolean
  /**
   * Current auth view. Widened to `string` because plugin-contributed views
   * (e.g. `"magicLink"`) aren't part of the built-in `AuthView` union.
   */
  view?: string
}

export function PasskeyButton({ isPending, view }: PasskeyButtonProps) {
  const { authClient, localization, redirectTo, navigate } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { mutate: signInPasskey, isPending: passkeyPending } = useSignInPasskey(
    authClient as PasskeyAuthClient,
    {
      onSuccess: () => navigate({ to: redirectTo })
    }
  )

  // Passkey sign-in isn't relevant on sign-up / forgot-password flows.
  if (view === "signUp" || view === "forgotPassword") return null

  const isDisabled = isPending || passkeyPending

  return (
    <Button
      className="w-full"
      variant="tertiary"
      isDisabled={isDisabled}
      isPending={passkeyPending}
      onPress={() => signInPasskey()}
    >
      {passkeyPending ? <Spinner color="current" size="sm" /> : <Fingerprint />}
      {localization.auth.continueWith.replace(
        "{{provider}}",
        passkeyLocalization.passkey
      )}
    </Button>
  )
}
