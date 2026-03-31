import { useAuth, useRevokeSession, useSession } from "@better-auth-ui/react"
import type { Session } from "better-auth"
import Bowser from "bowser"
import { LogOut, Monitor, Smartphone, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

  const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1]
  ]

  for (const [unit, threshold] of UNITS) {
    if (seconds >= threshold) {
      return rtf.format(-Math.floor(seconds / threshold), unit)
    }
  }

  return rtf.format(0, "second")
}

export type ActiveSessionProps = {
  session: Session
}

/**
 * Render a single active session row with device info and revoke control.
 *
 * Shows the session's browser, OS, and creation time. The current session is marked
 * and navigates to sign-out on click, while other sessions can be revoked individually.
 *
 * @param session - The session object containing id, token, userAgent, ipAddress, and createdAt
 * @returns A JSX element containing the active session row
 */
export function ActiveSession({ session }: ActiveSessionProps) {
  const { basePaths, localization, viewPaths, navigate } = useAuth()
  const { data: sessionData } = useSession()

  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession({
    onError: (error) => toast.error(error.error?.message || error.message),
    onSuccess: () => toast.success(localization.settings.revokeSessionSuccess)
  })

  const isCurrentSession = session.token === sessionData?.session.token
  const ua = Bowser.parse(session.userAgent || "")
  const isMobile =
    ua.platform.type === "mobile" || ua.platform.type === "tablet"

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        {isMobile ? (
          <Smartphone className="size-4.5" />
        ) : (
          <Monitor className="size-4.5" />
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">
          {ua.browser.name || "Unknown Browser"}
          {ua.os.name ? `, ${ua.os.name}` : ""}
        </span>

        {isCurrentSession ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary w-fit">
            {localization.settings.currentSession}
          </span>
        ) : (
          session.createdAt && (
            <span className="text-xs text-muted-foreground">
              {timeAgo(session.createdAt)}
            </span>
          )
        )}
      </div>

      <Button
        className="ml-auto shrink-0"
        variant="outline"
        size="sm"
        onClick={() =>
          isCurrentSession
            ? navigate({
                to: `${basePaths.auth}/${viewPaths.auth.signOut}`
              })
            : revokeSession({ token: session.token })
        }
        disabled={isRevoking}
        aria-label={
          isCurrentSession
            ? localization.auth.signOut
            : localization.settings.revokeSession
        }
      >
        {isRevoking ? <Spinner /> : isCurrentSession ? <LogOut /> : <X />}

        {isCurrentSession
          ? localization.auth.signOut
          : localization.settings.revoke}
      </Button>
    </div>
  )
}
