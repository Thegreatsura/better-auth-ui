import { useAuth } from "@better-auth-ui/react"
import { type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"
import { Appearance } from "./appearance"
import { ChangeEmail } from "./change-email"
import { ManageAccounts } from "./manage-accounts"
import { UserProfile } from "./user-profile"
export type AccountSettingsProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Renders the account settings layout including user profile, change email, appearance, and accounts management.
 *
 * UserProfile, ChangeEmail, and Appearance are always rendered; Accounts is rendered when `multiSession` is enabled.
 *
 * @param className - Optional additional CSS class names for the outer container.
 * @param variant - Card variant forwarded to each account settings card.
 * @returns The account settings container as a JSX element.
 */
export function AccountSettings({
  className,
  variant,
  ...props
}: AccountSettingsProps & ComponentProps<"div">) {
  const {
    multiSession,
    emailAndPassword,
    magicLink,
    appearance: { setTheme }
  } = useAuth()

  return (
    <div
      className={cn("flex w-full flex-col gap-4 md:gap-6", className)}
      {...props}
    >
      <UserProfile variant={variant} />
      {(emailAndPassword?.enabled || magicLink) && (
        <ChangeEmail variant={variant} />
      )}
      {setTheme && <Appearance variant={variant} />}
      {multiSession && <ManageAccounts variant={variant} />}
    </div>
  )
}
