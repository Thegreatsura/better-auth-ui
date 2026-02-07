import { useAuth, useListAccounts } from "@better-auth-ui/react"
import { Card, type CardProps, cn, Skeleton, toast } from "@heroui/react"
import { LinkedAccount } from "./linked-account"

export type LinkedAccountsProps = {
  className?: string
  variant?: CardProps["variant"]
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
export function LinkedAccounts({
  className,
  ...props
}: LinkedAccountsProps & CardProps) {
  const { localization, socialProviders } = useAuth()

  const { data: accounts, isPending } = useListAccounts({
    throwOnError: (error) => {
      if (error.error) toast.danger(error.error.message)
      return false
    }
  })

  return (
    <Card className={cn("p-4 md:p-6 gap-4", className)} {...props}>
      <Card.Header>
        <Card.Title className="text-xl">
          {localization.settings.linkedAccounts}
        </Card.Title>
      </Card.Header>

      <Card.Content className="gap-3">
        {isPending ? (
          <AccountRowSkeleton />
        ) : (
          <>
            {accounts
              ?.filter((account) => account.providerId !== "credential")
              .map((account) => (
                <LinkedAccount
                  key={account.id}
                  account={account}
                  provider={account.providerId}
                />
              ))}

            {socialProviders?.map((provider) => {
              return <LinkedAccount key={provider} provider={provider} />
            })}
          </>
        )}
      </Card.Content>
    </Card>
  )
}

function AccountRowSkeleton() {
  return (
    <div className="flex items-center rounded-3xl border p-3 justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
