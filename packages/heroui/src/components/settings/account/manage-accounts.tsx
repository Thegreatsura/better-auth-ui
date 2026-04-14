import {
  useAuth,
  useListDeviceSessions,
  useSession
} from "@better-auth-ui/react"
import { Card, type CardProps, cn, toast } from "@heroui/react"
import { ManageAccount } from "./manage-account"

export type ManageAccountsProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Render a card that lists and manages all device sessions for the current user.
 *
 * Shows each session with user information and actions to switch to or revoke a session.
 * When device session data is loading, a pending placeholder row is displayed.
 *
 * @returns A JSX element containing the accounts management card
 */
export function ManageAccounts({
  className,
  variant,
  ...props
}: ManageAccountsProps & CardProps) {
  const { localization } = useAuth()
  const { data: session } = useSession()

  const { data: deviceSessions, isPending } = useListDeviceSessions({
    throwOnError: (error) => {
      if (error.error) toast.danger(error.error.message)
      return false
    }
  })

  const otherSessions = deviceSessions?.filter(
    (deviceSession) => deviceSession.session.id !== session?.session.id
  )

  const allRows = [
    {
      key: "current",
      deviceSession: !isPending ? session : null,
      isPending
    },
    ...(otherSessions?.map((deviceSession) => ({
      key: deviceSession.session.id,
      deviceSession,
      isPending: false
    })) ?? [])
  ]

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {localization.settings.manageAccounts}
      </h2>

      <Card className={cn(className)} variant={variant} {...props}>
        <Card.Content className="gap-0">
          {allRows.map((row, index) => (
            <div key={row.key}>
              {index > 0 && (
                <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
              )}

              <ManageAccount
                deviceSession={row.deviceSession}
                isPending={row.isPending}
              />
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  )
}
