import { useAuth, useAuthPlugin, useDeletePasskey } from "@better-auth-ui/react"
import { Fingerprint, Xmark } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"

export type PasskeyProps = {
  passkey: {
    id: string
    name?: string | null
    createdAt: Date
  }
}

export function Passkey({ passkey }: PasskeyProps) {
  const { localization } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { mutate: deletePasskey, isPending } = useDeletePasskey()

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
        <Fingerprint className="size-4.5" />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-tight">
          {passkey.name || passkeyLocalization.passkey}
        </span>

        <span className="text-xs text-muted">
          {new Date(passkey.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
          })}
        </span>
      </div>

      <Button
        className="ml-auto shrink-0"
        variant="outline"
        size="sm"
        isPending={isPending}
        onPress={() => deletePasskey({ id: passkey.id })}
      >
        {isPending ? <Spinner color="current" size="sm" /> : <Xmark />}
        {localization.settings.delete}
      </Button>
    </div>
  )
}
