"use client"

import { authMutationKeys } from "@better-auth-ui/core"
import {
  type PasskeyAuthClient,
  useAuth,
  useSignInPasskey
} from "@better-auth-ui/react"
import { useIsMutating } from "@tanstack/react-query"
import { Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function PasskeyButton() {
  const { authClient, localization, redirectTo, navigate } = useAuth()

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

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      className={cn("w-full", isPending && "opacity-50 pointer-events-none")}
      onClick={() => signInPasskey()}
    >
      {passkeyPending ? <Spinner /> : <Fingerprint />}
      {localization.auth.continueWith.replace("{{provider}}", "Passkey")}
    </Button>
  )
}
