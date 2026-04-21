"use client"

import {
  type PasskeyAuthClient,
  useAddPasskey,
  useAuth,
  useAuthPlugin,
  useListUserPasskeys
} from "@better-auth-ui/react"
import {
  Button,
  Card,
  type CardProps,
  cn,
  Skeleton,
  Spinner
} from "@heroui/react"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"
import { Passkey } from "./passkey"

export type PasskeysProps = {
  className?: string
  variant?: CardProps["variant"]
}

export function Passkeys({
  className,
  variant,
  ...props
}: PasskeysProps & Omit<CardProps, "children">) {
  const { authClient } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { data: passkeys, isPending } = useListUserPasskeys(
    authClient as PasskeyAuthClient
  )
  const { mutate: addPasskey, isPending: isAdding } = useAddPasskey(
    authClient as PasskeyAuthClient
  )

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {passkeyLocalization.passkeys}
      </h2>

      <Card className={cn(className)} variant={variant} {...props}>
        <Card.Content className="gap-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium leading-tight">
                {passkeyLocalization.passkeysDescription}
              </p>

              <p className="text-muted text-xs mt-0.5">
                {passkeyLocalization.passkeysInstructions}
              </p>
            </div>

            <Button
              className="shrink-0"
              size="sm"
              isPending={isAdding}
              isDisabled={isPending}
              onPress={() => addPasskey()}
            >
              {isAdding && <Spinner color="current" size="sm" />}
              {passkeyLocalization.addPasskey}
            </Button>
          </div>

          {isPending ? (
            <>
              <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
              <PasskeySkeleton />
            </>
          ) : (
            passkeys?.map((passkey) => (
              <div key={passkey.id}>
                <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
                <Passkey passkey={passkey} />
              </div>
            ))
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

function PasskeySkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
