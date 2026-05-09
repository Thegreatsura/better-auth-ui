import { useAuthPlugin } from "@better-auth-ui/react"
import { Key } from "@gravity-ui/icons"
import { Button } from "@heroui/react"

import { apiKeyPlugin } from "../../../lib/auth/api-key-plugin"

export type ApiKeysEmptyProps = {
  onCreatePress: () => void
}

export function ApiKeysEmpty({ onCreatePress }: ApiKeysEmptyProps) {
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary">
        <Key className="size-4.5" />
      </div>

      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-semibold">{apiKeyLocalization.noApiKeys}</p>

        <p className="text-muted text-xs">
          {apiKeyLocalization.apiKeysDescription}
        </p>
      </div>

      <Button size="sm" onPress={onCreatePress}>
        {apiKeyLocalization.createApiKey}
      </Button>
    </div>
  )
}
