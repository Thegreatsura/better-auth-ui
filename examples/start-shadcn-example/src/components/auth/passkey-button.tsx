"use client"

import {
  type PasskeyAuthClient,
  useAuth,
  useSignInPasskey
} from "@better-auth-ui/react"
import { Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type PasskeyButtonProps = {
  isPending: boolean
}

export function PasskeyButton({ isPending }: PasskeyButtonProps) {
  const { authClient, localization, redirectTo, navigate } = useAuth()

  const { mutate: signInPasskey, isPending: passkeyPending } = useSignInPasskey(
    authClient as PasskeyAuthClient,
    {
      onSuccess: () => navigate({ to: redirectTo })
    }
  )

  const isDisabled = isPending || passkeyPending

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isDisabled}
      className={cn("w-full", isDisabled && "opacity-50 pointer-events-none")}
      onClick={() => signInPasskey()}
    >
      {passkeyPending ? <Spinner /> : <Fingerprint />}
      {localization.auth.continueWith.replace("{{provider}}", "Passkey")}
    </Button>
  )
}
