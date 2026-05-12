import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCancelInvitation,
  useHasPermission,
  useListOrganizationInvitations
} from "@better-auth-ui/react"
import { Xmark } from "@gravity-ui/icons"
import { Button, Chip, cn, Skeleton, Spinner, Table } from "@heroui/react"
import { type ComponentProps, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationInvitationsEmpty } from "./organization-invitations-empty"

/** Props for the {@link OrganizationInvitations} component. */
export type OrganizationInvitationsProps = {
  className?: string
}

type OrganizationInvitationRow = {
  id: string
  email: string
  role: string
  status?: string
  createdAt?: string | Date
}

function formatInvitationCreatedAt(value: unknown): string {
  if (value == null) return "—"
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  })
}

/**
 * Normalizes {@link useListOrganizationInvitations} data: Better Auth returns a
 * bare array from `listInvitations`, not `{ invitations: [...] }`.
 */
function invitationsListFromResponse(
  data: unknown
): OrganizationInvitationRow[] {
  if (Array.isArray(data)) {
    return data as OrganizationInvitationRow[]
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { invitations?: unknown }).invitations)
  ) {
    return (data as { invitations: OrganizationInvitationRow[] }).invitations
  }

  return []
}

/**
 * HeroUI {@link Table} of organization invitations (no surrounding {@link Card}).
 * Matches the layout patterns used by {@link OrganizationMembers}.
 */
export function OrganizationInvitations({
  className,
  ...props
}: OrganizationInvitationsProps & ComponentProps<"div">) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: invitationsPayload, isPending } =
    useListOrganizationInvitations(authClient as OrganizationAuthClient)

  const {
    data: cancelInvitationPermission,
    isPending: isCancelInvitationPermissionPending
  } = useHasPermission(authClient as OrganizationAuthClient, {
    permissions: { invitation: ["cancel"] }
  })

  const userHasPermissionToCancelInvitation =
    !isCancelInvitationPermissionPending &&
    cancelInvitationPermission?.success === true

  const invitationList = invitationsListFromResponse(invitationsPayload)

  const [inviteOpen, setInviteOpen] = useState(false)

  const tableHeader = (
    <Table.Header>
      <Table.Column isRowHeader>{localization.auth.email}</Table.Column>

      <Table.Column className="whitespace-nowrap">
        {organizationLocalization.invited}
      </Table.Column>

      <Table.Column>{organizationLocalization.role}</Table.Column>

      <Table.Column>{organizationLocalization.status}</Table.Column>

      <Table.Column className="w-px text-end">
        {organizationLocalization.actions}
      </Table.Column>
    </Table.Header>
  )

  return (
    <div className={cn("flex w-full flex-col gap-3", className)} {...props}>
      <h3 className="truncate text-sm font-semibold">
        {organizationLocalization.invitations}
      </h3>

      {isPending ? (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={organizationLocalization.invitations}
              aria-busy="true"
            >
              {tableHeader}

              <Table.Body>
                {Array.from({ length: 3 }, (_, index) => (
                  <OrganizationInvitationsTableSkeletonRow
                    key={`invitation-skeleton-${index.toString()}`}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      ) : !invitationList.length ? (
        <OrganizationInvitationsEmpty
          onInvitePress={() => setInviteOpen(true)}
        />
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={organizationLocalization.invitations}>
              {tableHeader}

              <Table.Body>
                {invitationList.map((invitation) => (
                  <InvitationTableRow
                    key={invitation.id}
                    invitation={invitation}
                    userHasPermissionToCancelInvitation={
                      userHasPermissionToCancelInvitation
                    }
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

function OrganizationInvitationsTableSkeletonRow() {
  return (
    <Table.Row>
      <Table.Cell>
        <Skeleton className="h-4 w-48 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-36 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </Table.Cell>

      <Table.Cell className="text-end">
        <Skeleton className="ml-auto size-8 rounded-lg" />
      </Table.Cell>
    </Table.Row>
  )
}

function InvitationTableRow({
  invitation,
  userHasPermissionToCancelInvitation
}: {
  invitation: OrganizationInvitationRow
  userHasPermissionToCancelInvitation: boolean
}) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { mutate, isPending } = useCancelInvitation(
    authClient as OrganizationAuthClient
  )

  const roleLabel = roles?.[invitation.role] ?? invitation.role

  const status = invitation.status

  const statusLabel =
    status === "pending"
      ? organizationLocalization.pending
      : status === "accepted"
        ? organizationLocalization.accepted
        : status === "rejected"
          ? organizationLocalization.rejected
          : status === "canceled"
            ? organizationLocalization.canceled
            : status

  const statusColor =
    status === "pending"
      ? "warning"
      : status === "accepted"
        ? "success"
        : status === "rejected"
          ? "danger"
          : "default"

  const isPendingInvitation =
    invitation.status === undefined || invitation.status === "pending"

  const showCancelInvitation =
    userHasPermissionToCancelInvitation && isPendingInvitation

  return (
    <Table.Row id={invitation.id}>
      <Table.Cell className="font-medium text-sm">
        {invitation.email}
      </Table.Cell>

      <Table.Cell className="text-muted text-xs tabular-nums">
        {formatInvitationCreatedAt(invitation.createdAt)}
      </Table.Cell>

      <Table.Cell className="text-sm">{roleLabel}</Table.Cell>

      <Table.Cell className="text-sm">
        <Chip className="shrink-0" color={statusColor} size="sm" variant="soft">
          {statusLabel}
        </Chip>
      </Table.Cell>

      <Table.Cell className="text-end">
        {showCancelInvitation ? (
          <Button
            isIconOnly
            size="sm"
            variant="danger-soft"
            isPending={isPending}
            onPress={() => mutate({ invitationId: invitation.id })}
            aria-label={organizationLocalization.cancelInvitation}
          >
            {isPending ? (
              <Spinner color="current" size="sm" />
            ) : (
              <Xmark className="size-4" />
            )}
          </Button>
        ) : null}
      </Table.Cell>
    </Table.Row>
  )
}
