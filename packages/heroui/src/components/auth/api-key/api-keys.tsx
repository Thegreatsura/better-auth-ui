import {
  type ApiKeyAuthClient,
  useAuth,
  useAuthPlugin,
  useListApiKeys
} from "@better-auth-ui/react"
import { Button, Card, type CardProps, cn } from "@heroui/react"
import { useState } from "react"

import { apiKeyPlugin } from "../../../lib/auth/api-key-plugin"
import { ApiKey } from "./api-key"
import { ApiKeySkeleton } from "./api-key-skeleton"
import { ApiKeysEmpty } from "./api-keys-empty"
import { CreateApiKeyDialog } from "./create-api-key-dialog"

export type ApiKeysProps = {
  className?: string
  variant?: CardProps["variant"]
}

export function ApiKeys({ className, variant }: ApiKeysProps) {
  const { authClient } = useAuth()
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)

  const { data: listData, isPending } = useListApiKeys(
    authClient as ApiKeyAuthClient
  )

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-sm font-semibold truncate">
          {apiKeyLocalization.apiKeys}
        </h2>

        <Button
          className="shrink-0"
          size="sm"
          isDisabled={isPending}
          onPress={() => setCreateOpen(true)}
        >
          {apiKeyLocalization.createApiKey}
        </Button>
      </div>

      <Card variant={variant}>
        <Card.Content>
          {isPending ? (
            <ApiKeySkeleton />
          ) : !listData?.apiKeys.length ? (
            <ApiKeysEmpty onCreatePress={() => setCreateOpen(true)} />
          ) : (
            listData?.apiKeys.map((key, index) => (
              <div key={key.id}>
                {index > 0 && (
                  <div className="border-b border-dashed -mx-4 my-4" />
                )}

                <ApiKey apiKey={key} />
              </div>
            ))
          )}
        </Card.Content>
      </Card>

      <CreateApiKeyDialog isOpen={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
