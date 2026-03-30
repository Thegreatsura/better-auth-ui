"use client"

import { useAuth, useListAccounts } from "@better-auth-ui/react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { LinkedAccount } from "./linked-account"

export type LinkedAccountsProps = {
  className?: string
}

/**
 * Render a card showing linked social accounts and available social providers to link.
 *
 * Linked accounts (excluding the "credential" provider) are shown with an unlink control;
 * available providers are shown with a link control. Button states and labels reflect
 * ongoing link/unlink activity and use localization for provider-specific text.
 *
 * @returns A JSX element containing the linked accounts card
 */
export function LinkedAccounts({ className }: LinkedAccountsProps) {
  const { localization, socialProviders } = useAuth()

  const { data: accounts, isPending } = useListAccounts({
    throwOnError: (error) => {
      if (error.error) toast.error(error.error.message)
      return false
    }
  })

  const linkedAccounts = accounts?.filter(
    (account) => account.providerId !== "credential"
  )

  const allRows = [
    ...(linkedAccounts?.map((account) => ({
      key: account.id,
      account,
      provider: account.providerId
    })) ?? []),
    ...(socialProviders?.map((provider) => ({
      key: provider,
      account: undefined,
      provider
    })) ?? [])
  ]

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        {localization.settings.linkedAccounts}
      </h2>

      <Card className={cn("w-full py-4 md:py-6", className)}>
        <CardContent className="px-4 md:px-6">
          {isPending ? (
            <AccountRowSkeleton />
          ) : (
            allRows.map((row, index) => (
              <div key={row.key}>
                {index > 0 && (
                  <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
                )}

                <LinkedAccount account={row.account} provider={row.provider} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AccountRowSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}
