import { useAuthPlugin } from "@better-auth-ui/react"
import { Clock } from "@gravity-ui/icons"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

/**
 * Empty state for `UserInvitations` — mirrors `ApiKeysEmpty` (icon, title,
 * description) without a primary action button.
 */
export function UserInvitationsEmpty() {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary">
        <Clock className="size-4.5" />
      </div>

      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-semibold">
          {organizationLocalization.noInvitations}
        </p>

        <p className="text-muted text-xs">
          {organizationLocalization.userInvitationsEmptyDescription}
        </p>
      </div>
    </div>
  )
}
