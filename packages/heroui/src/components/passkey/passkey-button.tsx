import { useAuth, useAuthPlugin, useSignInPasskey } from "@better-auth-ui/react"
import { Fingerprint } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"

export type PasskeyButtonProps = {
  isPending?: boolean
}

export function PasskeyButton({ isPending }: PasskeyButtonProps) {
  const { localization, redirectTo, navigate } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { mutate: signInPasskey, isPending: passkeyPending } = useSignInPasskey(
    {
      onSuccess: () => navigate({ to: redirectTo })
    }
  )

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
