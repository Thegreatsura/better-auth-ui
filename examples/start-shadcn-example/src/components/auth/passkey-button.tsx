"use client"

import { type AuthView, authMutationKeys } from "@better-auth-ui/core"
import {
  type PasskeyAuthClient,
  useAuth,
  useAuthPlugin,
  useSignInPasskey
} from "@better-auth-ui/react"
import { useIsMutating } from "@tanstack/react-query"
import { Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { passkeyPlugin } from "@/lib/passkey/passkey-plugin"
import { cn } from "@/lib/utils"

export type PasskeyButtonProps = {
  /** @remarks `AuthView` */
  view?: AuthView
}

/**
 * "Continue with Passkey" button rendered alongside the password sign-in form.
 *
 * Hidden on sign-up and forgot-password views where passkey sign-in isn't applicable.
 *
 * @param view - Current auth view. Hides the button on `"signUp"` and `"forgotPassword"`.
 */
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

  // Passkey sign-in isn't relevant on sign-up / forgot-password flows.
  if (view === "signUp" || view === "forgotPassword") return null

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      className={cn("w-full", isPending && "opacity-50 pointer-events-none")}
      onClick={() => signInPasskey()}
    >
      {passkeyPending ? <Spinner /> : <Fingerprint />}
      {localization.auth.continueWith.replace(
        "{{provider}}",
        passkeyLocalization.passkey
      )}
    </Button>
  )
}
