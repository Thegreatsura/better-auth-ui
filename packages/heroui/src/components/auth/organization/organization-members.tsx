import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizationMembers
} from "@better-auth-ui/react"
import { Button, cn, Table } from "@heroui/react"
import { type ComponentProps, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"

/** Props for the {@link OrganizationMembers} component. */
export type OrganizationMembersProps = {
  className?: string
}

/**
 * Organization members table with title, invite control, and per-row actions.
 */
export function OrganizationMembers({
  className,
  ...props
}: OrganizationMembersProps & ComponentProps<"div">) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: membersData, isPending } = useListOrganizationMembers(
    authClient as OrganizationAuthClient
  )

  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="flex items-end justify-between gap-3">
        <h3 className="truncate text-sm font-semibold">
          {organizationLocalization.members}
        </h3>

        <Button
          className="shrink-0"
          size="sm"
          isDisabled={isPending}
          onPress={() => setInviteOpen(true)}
        >
          {organizationLocalization.inviteMember}
        </Button>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={organizationLocalization.members}>
            <Table.Header>
              <Table.Column isRowHeader>
                {organizationLocalization.member}
              </Table.Column>

              <Table.Column isRowHeader>
                {organizationLocalization.role}
              </Table.Column>

              <Table.Column className="text-end" isRowHeader>
                {organizationLocalization.actions}
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {isPending ? (
                <OrganizationMemberRowSkeleton />
              ) : (
                membersData?.members.map((member) => (
                  <OrganizationMemberRow key={member.id} member={member} />
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
