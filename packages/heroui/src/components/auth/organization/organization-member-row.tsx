import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useLeaveOrganization,
  useRemoveMember,
  useUpdateMemberRole
} from "@better-auth-ui/react"
import { Pencil, TrashBin } from "@gravity-ui/icons"
import { Button, Dropdown, Label, Spinner, Table, toast } from "@heroui/react"
import type { Member, User } from "better-auth/client"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserView } from "../user/user-view"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"

export type OrganizationMemberRowProps = {
  member: Member & { user: Partial<User> }
  isOwner?: boolean
}

export function OrganizationMemberRow({
  member,
  isOwner
}: OrganizationMemberRowProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: hasUpdatePermission, isPending: updatePermissionPending } =
    useHasPermission(authClient as OrganizationAuthClient, {
      permissions: { member: ["update"] }
    })

  const { data: hasDeletePermission, isPending: deletePermissionPending } =
    useHasPermission(authClient as OrganizationAuthClient, {
      permissions: { member: ["delete"] }
    })

  const isPending = updatePermissionPending || deletePermissionPending

  const { mutate: removeMember, isPending: removing } = useRemoveMember(
    authClient as OrganizationAuthClient
  )

  const { mutate: updateMemberRole, isPending: isUpdatingRole } =
    useUpdateMemberRole(authClient as OrganizationAuthClient)

  const { mutate: leaveOrganization, isPending: leaving } =
    useLeaveOrganization(authClient as OrganizationAuthClient)

  const roleLabel = roles?.[member.role] ?? member.role

  const assignableRoles = Object.entries(roles).filter(
    ([key]) => isOwner || key !== "owner"
  )

  const setRole = (role: string) => {
    updateMemberRole(
      { memberId: member.id, role: role },
      {
        onSuccess: () =>
          toast.success(organizationLocalization.memberRoleUpdated)
      }
    )
  }

  if (isPending) {
    return <OrganizationMemberRowSkeleton />
  }

  return (
    <Table.Row>
      <Table.Cell>
        <UserView user={member.user} />
      </Table.Cell>

      <Table.Cell>{roleLabel}</Table.Cell>

      <Table.Cell>
        <div className="flex items-center justify-end gap-1">
          {hasUpdatePermission?.success && (
            <Dropdown>
              <Button
                isIconOnly
                size="sm"
                variant="tertiary"
                isDisabled={isUpdatingRole}
                aria-label={organizationLocalization.changeMemberRole}
              >
                {isUpdatingRole ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <Pencil />
                )}
              </Button>

              <Dropdown.Popover className="min-w-fit">
                <Dropdown.Menu>
                  {assignableRoles.map(([key, label]) => (
                    <Dropdown.Item
                      key={key}
                      textValue={label}
                      isDisabled={member.role === key}
                      onAction={() => setRole(key)}
                    >
                      <Label>{label}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

          {hasDeletePermission?.success && (
            <Button
              isIconOnly
              size="sm"
              variant="danger-soft"
              aria-label={organizationLocalization.removeMember}
            >
              <TrashBin />
            </Button>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}
