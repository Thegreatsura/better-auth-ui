import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationInvitations
} from "@better-auth-ui/react"
import { cn, Table } from "@heroui/react"
import { type ComponentProps, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationInvitationTableRow } from "./organization-invitation-row"
import { OrganizationInvitationRowSkeleton } from "./organization-invitation-row-skeleton"
import { OrganizationInvitationsEmpty } from "./organization-invitations-empty"

/** Props for the {@link OrganizationInvitations} component. */
export type OrganizationInvitationsProps = {
  className?: string
}

/**
 * Organization invitations table with invite control and per-row actions.
 */
export function OrganizationInvitations({
  className,
  ...props
}: OrganizationInvitationsProps & ComponentProps<"div">) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: invitations, isPending: invitationsPending } =
    useListOrganizationInvitations(authClient as OrganizationAuthClient)

  const { isPending: invitationPermissionPending } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: { invitation: ["cancel"] }
    }
  )

  const isPending = invitationsPending || invitationPermissionPending

  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <h3 className="truncate text-sm font-semibold">
        {organizationLocalization.invitations}
      </h3>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={organizationLocalization.invitations}>
            <Table.Header>
              <Table.Column isRowHeader>{localization.auth.email}</Table.Column>

              <Table.Column>{organizationLocalization.invitedAt}</Table.Column>

              <Table.Column>{organizationLocalization.role}</Table.Column>

              <Table.Column>{organizationLocalization.status}</Table.Column>

              <Table.Column className="text-end">
                {organizationLocalization.actions}
              </Table.Column>
            </Table.Header>

            <Table.Body
              renderEmptyState={() => (
                <OrganizationInvitationsEmpty
                  onInvitePress={() => setInviteOpen(true)}
                />
              )}
            >
              {isPending ? (
                <OrganizationInvitationRowSkeleton />
              ) : (
                invitations?.map((invitation) => (
                  <OrganizationInvitationTableRow
                    key={invitation.id}
                    invitation={invitation}
                  />
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <InviteMemberDialog isOpen={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
