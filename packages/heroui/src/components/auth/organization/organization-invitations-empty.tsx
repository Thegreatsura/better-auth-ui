import { useAuthPlugin } from "@better-auth-ui/react"
import { PaperPlane } from "@gravity-ui/icons"
import { Button } from "@heroui/react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

export type OrganizationInvitationsEmptyProps = {
  onInvitePress: () => void
}

/**
 * Empty state for {@link OrganizationInvitations} — mirrors `ApiKeysEmpty`
 * (icon, title, description) with an "Invite member" call to action.
 */
export function OrganizationInvitationsEmpty({
  onInvitePress
}: OrganizationInvitationsEmptyProps) {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary">
        <PaperPlane className="size-4.5" />
      </div>

      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-semibold">
          {organizationLocalization.noInvitations}
        </p>

        <p className="text-muted text-xs">
          {organizationLocalization.organizationInvitationsEmptyDescription}
        </p>
      </div>

      <Button size="sm" onPress={onInvitePress}>
        {organizationLocalization.inviteMember}
      </Button>
    </div>
  )
}
