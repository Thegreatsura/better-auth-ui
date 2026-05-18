import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizationMembers,
  useRemoveMember,
  useUpdateMemberRole
} from "@better-auth-ui/react"
import { Pencil, TrashBin } from "@gravity-ui/icons"
import {
  Button,
  cn,
  Dropdown,
  Label,
  Skeleton,
  Table,
  toast
} from "@heroui/react"
import { type ComponentProps, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserView, type UserViewProps } from "../user/user-view"
import { InviteMemberDialog } from "./invite-member-dialog"

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

  const { data: members, isPending } = useListOrganizationMembers(
    authClient as OrganizationAuthClient
  )

  const memberList = (
    members as { members?: MemberRowProps["member"][] } | undefined
  )?.members

  const [inviteOpen, setInviteOpen] = useState(false)

  const tableHeader = (
    <Table.Header>
      <Table.Column isRowHeader>{organizationLocalization.member}</Table.Column>

      <Table.Column>{organizationLocalization.role}</Table.Column>

      <Table.Column className="w-px text-end">
        {organizationLocalization.actions}
      </Table.Column>
    </Table.Header>
  )

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

      {isPending ? (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={organizationLocalization.members}
              aria-busy="true"
              className="min-w-[36rem]"
            >
              {tableHeader}

              <Table.Body>
                {Array.from({ length: 5 }, (_, index) => (
                  <MembersTableSkeletonRow
                    key={`member-skeleton-${index.toString()}`}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={organizationLocalization.members}
              className="min-w-[36rem]"
            >
              {tableHeader}

              <Table.Body>
                {(memberList ?? []).map((member) => (
                  <MemberTableRow
                    key={member.id}
                    member={member}
                    isOwner={member.role === "owner"}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <InviteMemberDialog isOpen={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function MembersTableSkeletonRow() {
  return (
    <Table.Row>
      <Table.Cell>
        <UserView isPending className="gap-3 py-0.5" size="md" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </Table.Cell>

      <Table.Cell className="text-end">
        <div className="ml-auto flex items-center justify-end gap-1">
          <Skeleton className="size-8 rounded-lg" />

          <Skeleton className="size-8 rounded-lg" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

type MemberRowProps = {
  member: {
    id: string
    user: {
      id: string
      name: string
      email: string
      image?: string
    }
    role: string
    createdAt: string
  }
  isOwner: boolean
}

function MemberTableRow({ member, isOwner }: MemberRowProps) {
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
