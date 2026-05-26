import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useRemoveMember,
  useUpdateMemberRole
} from "@better-auth-ui/react"
import { Pencil, TrashBin } from "@gravity-ui/icons"
import { Button, Dropdown, Label, Table, toast } from "@heroui/react"
import type { Member, User } from "better-auth/client"
import { useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserView, type UserViewProps } from "../user/user-view"

export type OrganizationMemberRowProps = {
  member: Member & { user: Partial<User> }
}

export function OrganizationMemberRow({ member }: OrganizationMemberRowProps) {
  const isOwner = member.role === "owner"
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const [confirmRemove, setConfirmRemove] = useState(false)

  const { mutate: removeMember, isPending: removing } = useRemoveMember(
    authClient as OrganizationAuthClient
  )

  const { mutate: updateMemberRole, isPending: updating } = useUpdateMemberRole(
    authClient as OrganizationAuthClient
  )

  const roleLabel = roles?.[member.role] ?? member.role

  const assignableRoles = Object.entries(roles ?? {}).filter(
    ([key]) => key !== "owner"
  )

  const setRole = (role: string) => {
    updateMemberRole(
      { memberId: member.id, role: role as "admin" | "member" },
      {
        onSuccess: () =>
          toast.success(organizationLocalization.memberRoleUpdated),
        onError: (error) =>
          toast.danger(
            error instanceof Error ? error.message : "Failed to update role"
          )
      }
    )
  }

  return (
    <Table.Row id={member.id}>
      <Table.Cell>
        <UserView
          className="gap-3 py-0.5"
          size="md"
          user={member.user as UserViewProps["user"]}
        />
      </Table.Cell>

      <Table.Cell className="min-w-52 text-sm">{roleLabel}</Table.Cell>

      <Table.Cell className="text-end">
        {!isOwner &&
          (confirmRemove ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setConfirmRemove(false)}
                isDisabled={removing}
              >
                {localization.settings.cancel}
              </Button>

              <Button
                size="sm"
                variant="danger"
                isPending={removing}
                onPress={() => {
                  removeMember({ memberIdOrEmail: member.id })
                  setConfirmRemove(false)
                }}
              >
                {organizationLocalization.confirm}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1">
              <Dropdown>
                <Button
                  isIconOnly
                  size="sm"
                  variant="tertiary"
                  isDisabled={removing || updating}
                  aria-label={organizationLocalization.changeMemberRole}
                >
                  <Pencil className="size-4" />
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

              <Button
                isIconOnly
                size="sm"
                variant="danger-soft"
                onPress={() => setConfirmRemove(true)}
                isDisabled={removing || updating}
                aria-label={organizationLocalization.removeMember}
              >
                <TrashBin className="size-4" />
              </Button>
            </div>
          ))}
      </Table.Cell>
    </Table.Row>
  )
}
