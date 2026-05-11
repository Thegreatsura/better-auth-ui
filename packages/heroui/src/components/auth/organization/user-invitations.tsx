import {
  type ListUserInvitationsData,
  type OrganizationAuthClient,
  useAcceptInvitation,
  useAuth,
  useAuthPlugin,
  useListUserInvitations,
  useRejectInvitation
} from "@better-auth-ui/react"
import { Check, Clock, Xmark } from "@gravity-ui/icons"
import {
  Button,
  Card,
  type CardProps,
  Chip,
  Skeleton,
  Spinner
} from "@heroui/react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { localizedOrganizationRole } from "./organization-role-label"
import { UserInvitationsEmpty } from "./user-invitations-empty"

export type UserInvitationItem = NonNullable<
  ListUserInvitationsData<OrganizationAuthClient>
>[number]

export type UserInvitationsProps = {
  variant?: CardProps["variant"]
}

/**
 * Organization invitations for the signed-in user (from
 * {@link useListUserInvitations}). Always renders the section card; uses
 * {@link UserInvitationsEmpty} when there are no pending invitations.
 */
export function UserInvitations({ variant }: UserInvitationsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: invitationsData, isPending } = useListUserInvitations(
    authClient as OrganizationAuthClient
  )

  const invitationList = invitationsData ?? []
  const hasInvitations = invitationList.length > 0

  return (
    <div className="flex flex-col gap-3">
      <h2 className="truncate text-sm font-semibold">
        {organizationLocalization.invitations}
      </h2>

      <Card variant={variant}>
        <Card.Content>
          {isPending ? (
            <UserInvitationsLoading />
          ) : !hasInvitations ? (
            <UserInvitationsEmpty />
          ) : (
            invitationList.map((invitation, index) => (
              <div key={invitation.id}>
                {index > 0 && (
                  <div className="border-b border-dashed -mx-4 my-4" />
                )}
                <UserInvitationRow invitation={invitation} />
              </div>
            ))
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

function UserInvitationsLoading() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 shrink-0 rounded-xl" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-40 rounded-lg" />

        <Skeleton className="h-3 w-28 rounded-lg" />
      </div>

      <div className="ml-auto flex shrink-0 gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />

        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
  )
}

function UserInvitationRow({ invitation }: { invitation: UserInvitationItem }) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation(authClient as OrganizationAuthClient)

  const { mutate: rejectInvitation, isPending: isRejecting } =
    useRejectInvitation(authClient as OrganizationAuthClient)

  const roleLabel = localizedOrganizationRole(
    invitation.role,
    organizationLocalization
  )

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
        <Clock className="size-4.5" />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 truncate text-sm font-medium leading-tight">
            {invitation.organizationName}
          </span>

          <Chip className="shrink-0" size="sm">
            {roleLabel}
          </Chip>
        </div>

        <span className="block min-w-0 truncate text-muted text-xs">
          {new Date(invitation.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
          })}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          isPending={isAccepting}
          isDisabled={isRejecting}
          onPress={() =>
            acceptInvitation({
              invitationId: invitation.id
            })
          }
        >
          {({ isPending: acceptPending }) => (
            <>
              {acceptPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <Check />
              )}
              {organizationLocalization.acceptInvitation}
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          isPending={isRejecting}
          isDisabled={isAccepting}
          onPress={() =>
            rejectInvitation({
              invitationId: invitation.id
            })
          }
          aria-label={organizationLocalization.rejectInvitation}
        >
          {({ isPending: rejectPending }) =>
            rejectPending ? (
              <Spinner color="current" size="sm" />
            ) : (
              <Xmark className="size-4 text-danger" />
            )
          }
        </Button>
      </div>
    </div>
  )
}
