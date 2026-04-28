"use client"

import {
  type PasskeyAuthClient,
  useAddPasskey,
  useAuth,
  useListPasskeys
} from "@better-auth-ui/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Passkey } from "./passkey"

export type PasskeysProps = {
  className?: string
}

export function Passkeys({ className }: PasskeysProps) {
  const { authClient } = useAuth()

  const { data: passkeys, isPending } = useListPasskeys(
    authClient as PasskeyAuthClient
  )

  const { mutate: addPasskey, isPending: isAdding } = useAddPasskey(
    authClient as PasskeyAuthClient
  )

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Passkeys</h2>

      <Card className={cn("p-0", className)}>
        <CardContent className="p-0">
          <Card className="bg-transparent border-0 ring-0 shadow-none">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium leading-tight">
                  Manage your passkeys for secure access.
                </p>

                <p className="text-muted-foreground text-xs mt-0.5">
                  Securely access your account without a password.
                </p>
              </div>

              <Button
                className="shrink-0"
                size="sm"
                disabled={isPending || isAdding}
                onClick={() => addPasskey()}
              >
                {isAdding && <Spinner />}
                Add passkey
              </Button>
            </CardContent>
          </Card>

          {isPending ? (
            <>
              <Separator />
              <PasskeySkeleton />
            </>
          ) : (
            passkeys?.map((passkey) => (
              <div key={passkey.id}>
                <Separator />
                <Passkey passkey={passkey} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PasskeySkeleton() {
  return (
    <Card className="bg-transparent border-0 ring-0 shadow-none">
      <CardContent className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
