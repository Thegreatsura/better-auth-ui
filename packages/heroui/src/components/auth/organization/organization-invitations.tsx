import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationInvitations,
  useRemoveInvitation
} from "@better-auth-ui/react"
import { Xmark } from "@gravity-ui/icons"
import { Button, Chip, cn, Skeleton, Spinner, Table } from "@heroui/react"
import type { ComponentProps } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { localizedOrganizationRole } from "./organization-role-label"

/** Props for the {@link OrganizationInvitations} component. */
export type OrganizationInvitationsProps = {
  className?: string
}

type OrganizationInvitationRow = {
  id: string
  email: string
  role: string
  status?: string
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
  const { authClient } = useAuth()
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

  const tableHeader = (
    <Table.Header>
      <Table.Column isRowHeader>{organizationLocalization.email}</Table.Column>

      <Table.Column>{organizationLocalization.role}</Table.Column>

      <Table.Column className="w-32">
        {organizationLocalization.invitationStatusColumn}
      </Table.Column>

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
              className="min-w-[42rem]"
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
        <p className="py-8 text-center text-muted text-sm">
          {organizationLocalization.noInvitations}
        </p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={organizationLocalization.invitations}
              className="min-w-[42rem]"
            >
              {tableHeader}

              <Table.Body>
                {invitationList.map((invitation) => (
                  <InvitationTableRow
                    key={invitation.id}
                    invitation={invitation}
                    organizationLocalization={organizationLocalization}
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
  organizationLocalization,
  userHasPermissionToCancelInvitation
}: {
  invitation: OrganizationInvitationRow
  organizationLocalization: OrganizationLocalization
  userHasPermissionToCancelInvitation: boolean
}) {
  const { authClient } = useAuth()

  const { mutate, isPending } = useRemoveInvitation(
    authClient as OrganizationAuthClient
  )

  const roleLabel = localizedOrganizationRole(
    invitation.role,
    organizationLocalization
  )

  const status = invitation.status

  const statusLabel =
    status === "pending"
      ? organizationLocalization.invitationStatusPending
      : status === "accepted"
        ? organizationLocalization.invitationStatusAccepted
        : status === "rejected"
          ? organizationLocalization.invitationStatusRejected
          : status === "canceled"
            ? organizationLocalization.invitationStatusCanceled
            : status
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : organizationLocalization.invitationStatusUnknown

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

      <Table.Cell className="min-w-52 text-sm">{roleLabel}</Table.Cell>

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
            aria-label={organizationLocalization.removeInvitation}
          >
            {({ isPending: cancelPending }) =>
              cancelPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <Xmark className="size-4" />
              )
            }
          </Button>
        ) : null}
      </Table.Cell>
    </Table.Row>
  )
}
