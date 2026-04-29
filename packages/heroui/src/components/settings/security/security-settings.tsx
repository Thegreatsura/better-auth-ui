import { useAuth } from "@better-auth-ui/react"
import { type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { ActiveSessions } from "./active-sessions"
import { ChangePassword } from "./change-password"
import { DangerZone } from "./danger-zone"
import { LinkedAccounts } from "./linked-accounts"

export type SecuritySettingsProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Renders the security settings layout including password management, linked accounts, and active sessions.
 *
 * ChangePassword is rendered when password authentication is enabled; LinkedAccounts is rendered when social providers are present.
 * DangerZone is rendered when `deleteUser.enabled` is true in auth config.
 *
 * @param className - Optional additional CSS class names for the outer container.
 * @param variant - Card variant forwarded to each security settings card.
 * @returns The security settings container as a JSX element.
 */
export function SecuritySettings({
  className,
  variant,
  ...props
}: SecuritySettingsProps & ComponentProps<"div">) {
  const { deleteUser, emailAndPassword, plugins, socialProviders } = useAuth()

  return (
    <div
      className={cn("flex w-full flex-col gap-4 md:gap-6", className)}
      {...props}
    >
      {emailAndPassword?.enabled && <ChangePassword variant={variant} />}
      {!!socialProviders?.length && <LinkedAccounts variant={variant} />}
      {plugins?.flatMap((plugin) =>
        plugin.securityCards?.map((Card, index) => (
          <Card key={`${plugin.id}-${index.toString()}`} variant={variant} />
        ))
      )}
      <ActiveSessions variant={variant} />
      {deleteUser?.enabled && <DangerZone variant={variant} />}
    </div>
  )
}
