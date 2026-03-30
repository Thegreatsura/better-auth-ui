"use client"

import { useAuth, useListSessions, useSession } from "@better-auth-ui/react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ActiveSession } from "./active-session"

export type ActiveSessionsProps = {
  className?: string
}

/**
 * Render a card listing all active sessions for the current user with revoke controls.
 *
 * Shows each session's browser, OS, IP address, and creation time. The current session is marked
 * and navigates to sign-out on click, while other sessions can be revoked individually.
 *
 * @returns A JSX element containing the sessions card
 */
export function ActiveSessions({ className }: ActiveSessionsProps) {
  const { localization } = useAuth()
  const { data: sessionData } = useSession()

  const { data: sessions, isPending } = useListSessions({
    throwOnError: (error) => {
      if (error.error) toast.error(error.error.message)
      return false
    }
  })

  const sortedSessions = sessions?.toSorted((session) =>
    session.id === sessionData?.session.id ? -1 : 1
  )

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        {localization.settings.activeSessions}
      </h2>

      <Card className={cn("w-full py-4 md:py-6", className)}>
        <CardContent className="px-4 md:px-6">
          {isPending ? (
            <SessionRowSkeleton />
          ) : (
            sortedSessions?.map((session, index) => (
              <div key={session.id}>
                {index > 0 && (
                  <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
                )}

                <ActiveSession session={session} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SessionRowSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}
