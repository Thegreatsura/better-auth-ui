import { type AuthView, authMutationKeys } from "@better-auth-ui/core"
import {
  type PasskeyAuthClient,
  useAuth,
  useAuthPlugin,
  useSignInPasskey
} from "@better-auth-ui/react"
import { Fingerprint } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"
import { useIsMutating } from "@tanstack/react-query"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"

export type PasskeyButtonProps = {
  /** @remarks `AuthView` */
  view?: AuthView
}

export function PasskeyButton({ view }: PasskeyButtonProps) {
  const { authClient, localization, redirectTo, navigate } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { mutate: signInPasskey, isPending: passkeyPending } = useSignInPasskey(
    authClient as PasskeyAuthClient,
    {
      onSuccess: () => navigate({ to: redirectTo })
    }
  )

  const signInMutating = useIsMutating({
    mutationKey: authMutationKeys.signIn.all
  })
  const signUpMutating = useIsMutating({
    mutationKey: authMutationKeys.signUp.all
  })
  const isPending = signInMutating + signUpMutating > 0

  // Passkey sign-in isn't relevant on the sign-up flow.
  if (view === "signUp") return null

  return (
    <Button
      className="w-full"
      variant="tertiary"
      isDisabled={isPending}
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
