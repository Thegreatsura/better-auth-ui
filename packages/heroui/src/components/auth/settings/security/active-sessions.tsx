import { useAuth, useListSessions, useSession } from "@better-auth-ui/react"
import { Card, type CardProps, cn, Skeleton } from "@heroui/react"
import { ActiveSession } from "./active-session"

export type ActiveSessionsProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Render a card listing all active sessions for the current user with revoke controls.
 *
 * Shows each session's browser, OS, IP address, and creation time. The current session is marked
 * and navigates to sign-out on click, while other sessions can be revoked individually.
 *
 * @returns A JSX element containing the sessions card
 */
export function ActiveSessions({
  className,
  variant,
  ...props
}: ActiveSessionsProps & Omit<CardProps, "children">) {
  const { authClient, localization } = useAuth()
  const { data: session } = useSession(authClient)

  const { data: sessions, isPending } = useListSessions(authClient)

  const activeSessions = sessions?.toSorted((activeSession) =>
    activeSession.id === session?.session.id ? -1 : 1
  )

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {localization.settings.activeSessions}
      </h2>

      <Card className={cn(className)} variant={variant} {...props}>
        <Card.Content className="gap-0">
          {isPending ? (
            <SessionRowSkeleton />
          ) : (
            activeSessions?.map((activeSession, index) => (
              <div key={activeSession.id}>
                {index > 0 && (
                  <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
                )}

                <ActiveSession activeSession={activeSession} />
              </div>
            ))
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

function SessionRowSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
