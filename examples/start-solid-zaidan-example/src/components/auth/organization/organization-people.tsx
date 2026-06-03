import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type {
  LeaveOrganizationParams,
  OrganizationAuthClient,
  RemoveMemberParams,
  UpdateMemberRoleParams
} from "@better-auth-ui/solid"
import {
  useActiveOrganization,
  useAuth,
  useCancelInvitation,
  useHasPermission,
  useLeaveOrganization,
  useListOrganizationInvitations,
  useListOrganizationMembers,
  useRemoveMember,
  useSession,
  useUpdateMemberRole
} from "@better-auth-ui/solid"
import { LogOut, Pencil, PlusCircle, Trash2, X } from "lucide-solid"
import { createMemo, createSignal, For, Show } from "solid-js"
import { toast } from "solid-sonner"
import { UserView } from "@/components/auth/user/user-view"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@/lib/utils"
import { InviteMemberDialog } from "./invite-member-dialog"

export type OrganizationPeopleProps = {
  class?: string
}

type OrganizationMember = {
  id: string
  organizationId: string
  role?: string | null
  userId?: string | null
  user?: {
    email?: string | null
    image?: string | null
    name?: string | null
  } | null
}

type RoleMap = Record<string, string>

const fallbackLocalization = {
  changeMemberRole: "Change member role",
  memberRoleUpdated: "Member role updated",
  removeMember: "Remove member",
  removeMemberWarning:
    "Are you sure you want to remove this member from the organization? They will lose access immediately.",
  memberRemoved: "Member removed",
  leaveOrganization: "Leave organization",
  leaveOrganizationDescription:
    "Leave this organization and lose access to its data and resources. You'll need a new invitation to rejoin.",
  leftOrganization: "You left the organization",
  member: "Member",
  admin: "Admin",
  owner: "Owner"
} satisfies Pick<
  OrganizationLocalization,
  | "changeMemberRole"
  | "memberRoleUpdated"
  | "removeMember"
  | "removeMemberWarning"
  | "memberRemoved"
  | "leaveOrganization"
  | "leaveOrganizationDescription"
  | "leftOrganization"
  | "member"
  | "admin"
  | "owner"
>

const fallbackRoles: RoleMap = {
  owner: fallbackLocalization.owner,
  admin: fallbackLocalization.admin,
  member: fallbackLocalization.member
}

type OrganizationInvitation = {
  createdAt?: Date | string | null
  email?: string | null
  id: string
  role?: string | null
  status?: string | null
}

function formatRole(role?: string | null) {
  if (!role) return "Member"

  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatStatus(status?: string | null) {
  if (!status) return "Pending"

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatInvitationDate(createdAt?: Date | string | null) {
  if (!createdAt) return "—"

  const date = createdAt instanceof Date ? createdAt : new Date(createdAt)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short"
  })
}

function RemoveMemberDialog(props: {
  localization: Pick<
    OrganizationLocalization,
    "removeMember" | "removeMemberWarning" | "memberRemoved"
  >
  member: OrganizationMember
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const auth = useAuth()
  const removeMember = useRemoveMember(
    auth.authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        props.onOpenChange(false)
        toast.success(props.localization.memberRemoved)
      }
    }
  )

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.localization.removeMember}</DialogTitle>
          <DialogDescription>
            {props.localization.removeMemberWarning}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            as={Button}
            disabled={removeMember.isPending}
            type="button"
            variant="outline"
          >
            {auth.localization.settings.cancel}
          </DialogClose>
          <Button
            disabled={removeMember.isPending}
            onClick={() =>
              removeMember.mutate({
                memberIdOrEmail: props.member.id,
                organizationId: props.member.organizationId
              } satisfies RemoveMemberParams)
            }
            type="button"
            variant="destructive"
          >
            {props.localization.removeMember}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LeaveOrganizationDialog(props: {
  localization: Pick<
    OrganizationLocalization,
    "leaveOrganization" | "leaveOrganizationDescription" | "leftOrganization"
  >
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const auth = useAuth()
  const activeOrganization = useActiveOrganization(
    auth.authClient as OrganizationAuthClient
  )
  const organizationSettingsPath =
    organizationPlugin().viewPaths.settings?.organizations ?? "organizations"
  const leaveOrganization = useLeaveOrganization(
    auth.authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        props.onOpenChange(false)
        toast.success(props.localization.leftOrganization)
        auth.navigate({
          replace: true,
          to: `${auth.basePaths.settings}/${organizationSettingsPath}`
        })
      }
    }
  )

  const handleLeave = () => {
    if (!activeOrganization.data) return

    leaveOrganization.mutate({
      organizationId: activeOrganization.data.id
    } satisfies LeaveOrganizationParams)
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.localization.leaveOrganization}</DialogTitle>
          <DialogDescription>
            {props.localization.leaveOrganizationDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            as={Button}
            disabled={leaveOrganization.isPending}
            type="button"
            variant="outline"
          >
            {auth.localization.settings.cancel}
          </DialogClose>
          <Button
            disabled={leaveOrganization.isPending || !activeOrganization.data}
            onClick={handleLeave}
            type="button"
            variant="destructive"
          >
            {props.localization.leaveOrganization}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OrganizationMemberRow(props: {
  isOwner: boolean
  localization: Pick<
    OrganizationLocalization,
    | "changeMemberRole"
    | "memberRoleUpdated"
    | "removeMember"
    | "removeMemberWarning"
    | "memberRemoved"
    | "leaveOrganization"
    | "leaveOrganizationDescription"
    | "leftOrganization"
  >
  member: OrganizationMember
  roles: RoleMap
}) {
  const auth = useAuth()
  const [removeOpen, setRemoveOpen] = createSignal(false)
  const [leaveOpen, setLeaveOpen] = createSignal(false)
  const session = useSession(auth.authClient)
  const user = () => props.member.user
  const permission = useHasPermission(
    auth.authClient as OrganizationAuthClient,
    {
      permissions: { member: ["update"] }
    }
  )
  const deletePermission = useHasPermission(
    auth.authClient as OrganizationAuthClient,
    {
      permissions: { member: ["delete"] }
    }
  )
  const updateMemberRole = useUpdateMemberRole(
    auth.authClient as OrganizationAuthClient,
    {
      onSuccess: () => toast.success(props.localization.memberRoleUpdated)
    }
  )
  const assignableRoles = () =>
    Object.entries(props.roles).filter(
      ([key]) => props.isOwner || key !== "owner"
    )

  return (
    <div class="flex items-center justify-between gap-4 rounded-md border p-3">
      <UserView
        image={user()?.image}
        label={user()?.name ?? user()?.email ?? "Member"}
        secondaryLabel={user()?.email}
      />
      <div class="flex shrink-0 items-center gap-2">
        <span class="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {props.roles[props.member.role ?? ""] ??
            formatRole(props.member.role)}
        </span>
        <Show when={permission.data?.success}>
          <DropdownMenu>
            <DropdownMenuTrigger
              as={Button}
              aria-label={props.localization.changeMemberRole}
              class=""
              disabled={updateMemberRole.isPending}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <Pencil class="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <For each={assignableRoles()}>
                {([role, label]) => (
                  <DropdownMenuItem
                    disabled={props.member.role === role}
                    onSelect={() =>
                      updateMemberRole.mutate({
                        memberId: props.member.id,
                        role: role as UpdateMemberRoleParams["role"]
                      })
                    }
                  >
                    {label}
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
        <Show
          when={
            deletePermission.data?.success &&
            props.member.userId !== session.data?.user.id
          }
        >
          <Button
            aria-label={props.localization.removeMember}
            onClick={() => setRemoveOpen(true)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <Trash2 class="size-4 text-destructive" />
          </Button>
        </Show>
        <Show when={props.member.userId === session.data?.user.id}>
          <Button
            aria-label={props.localization.leaveOrganization}
            onClick={() => setLeaveOpen(true)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <LogOut class="size-4 text-destructive" />
          </Button>
        </Show>
      </div>
      <RemoveMemberDialog
        localization={props.localization}
        member={props.member}
        onOpenChange={setRemoveOpen}
        open={removeOpen()}
      />
      <LeaveOrganizationDialog
        localization={props.localization}
        onOpenChange={setLeaveOpen}
        open={leaveOpen()}
      />
    </div>
  )
}

function OrganizationMemberRowSkeleton() {
  return (
    <div class="flex items-center justify-between gap-4 rounded-md border p-3">
      <UserView isPending />
      <Skeleton class="h-6 w-16 rounded-md" />
    </div>
  )
}

function OrganizationInvitationRow(props: {
  invitation: OrganizationInvitation
}) {
  const auth = useAuth()
  const permission = useHasPermission(
    auth.authClient as OrganizationAuthClient,
    {
      permissions: { invitation: ["cancel"] }
    }
  )
  const cancelInvitation = useCancelInvitation(
    auth.authClient as OrganizationAuthClient
  )

  return (
    <div class="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div class="grid min-w-0 gap-1">
        <span class="truncate text-sm font-medium text-foreground">
          {props.invitation.email ?? "Invitation"}
        </span>
        <span class="text-xs text-muted-foreground">
          Invited {formatInvitationDate(props.invitation.createdAt)}
        </span>
      </div>
      <div class="flex flex-wrap gap-2 sm:justify-end">
        <span class="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {formatRole(props.invitation.role)}
        </span>
        <span class="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {formatStatus(props.invitation.status)}
        </span>
        <Show
          when={
            permission.data?.success && props.invitation.status === "pending"
          }
        >
          <Button
            aria-label="Cancel invitation"
            disabled={cancelInvitation.isPending}
            onClick={() =>
              cancelInvitation.mutate({
                invitationId: props.invitation.id
              })
            }
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <X class="size-4 text-destructive" />
          </Button>
        </Show>
      </div>
    </div>
  )
}

function OrganizationInvitationRowSkeleton() {
  return (
    <div class="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div class="grid gap-1">
        <Skeleton class="h-4 w-40 rounded-md" />
        <Skeleton class="h-3 w-28 rounded-md" />
      </div>
      <div class="flex gap-2 sm:justify-end">
        <Skeleton class="h-6 w-16 rounded-md" />
        <Skeleton class="h-6 w-20 rounded-md" />
      </div>
    </div>
  )
}

export function OrganizationPeople(props: OrganizationPeopleProps) {
  const auth = useAuth()
  const [inviteOpen, setInviteOpen] = createSignal(false)
  const session = useSession(auth.authClient)
  const members = useListOrganizationMembers(
    auth.authClient as OrganizationAuthClient
  )
  const invitations = useListOrganizationInvitations(
    auth.authClient as OrganizationAuthClient
  )
  const memberRows = () => (members.data?.members ?? []) as OrganizationMember[]
  const invitationRows = () =>
    (invitations.data ?? []) as OrganizationInvitation[]
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | {
          localization?: Pick<
            OrganizationLocalization,
            | "changeMemberRole"
            | "memberRoleUpdated"
            | "removeMember"
            | "removeMemberWarning"
            | "memberRemoved"
            | "leaveOrganization"
            | "leaveOrganizationDescription"
            | "leftOrganization"
          >
          roles?: RoleMap
        }
      | undefined
  const localization = () =>
    organizationPluginConfig()?.localization ?? fallbackLocalization
  const roles = createMemo(
    () => organizationPluginConfig()?.roles ?? fallbackRoles
  )
  const isOwner = () =>
    memberRows().some(
      (member) =>
        member.role === "owner" && member.userId === session.data?.user.id
    )

  return (
    <div class={cn("grid gap-4 md:gap-6", props.class)}>
      <Card>
        <CardHeader class="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="grid gap-1.5">
            <CardTitle>Members</CardTitle>
            <CardDescription>
              View the members of the active organization.
            </CardDescription>
          </div>
          <Button onClick={() => setInviteOpen(true)} size="sm" type="button">
            <PlusCircle class="size-4" />
            Invite member
          </Button>
        </CardHeader>
        <CardContent>
          <Show
            when={!members.isPending}
            fallback={
              <div class="grid gap-2">
                <OrganizationMemberRowSkeleton />
                <OrganizationMemberRowSkeleton />
              </div>
            }
          >
            <Show
              when={memberRows().length > 0}
              fallback={
                <p class="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No members found for this organization.
                </p>
              }
            >
              <div class="grid gap-2">
                <For each={memberRows()}>
                  {(member) => (
                    <OrganizationMemberRow
                      isOwner={isOwner()}
                      localization={localization()}
                      member={member}
                      roles={roles()}
                    />
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
          <CardDescription>
            View pending and historical invitations for the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Show
            when={!invitations.isPending}
            fallback={
              <div class="grid gap-2">
                <OrganizationInvitationRowSkeleton />
                <OrganizationInvitationRowSkeleton />
              </div>
            }
          >
            <Show
              when={invitationRows().length > 0}
              fallback={
                <p class="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No invitations found for this organization.
                </p>
              }
            >
              <div class="grid gap-2">
                <For each={invitationRows()}>
                  {(invitation) => (
                    <OrganizationInvitationRow invitation={invitation} />
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </CardContent>
      </Card>

      <InviteMemberDialog open={inviteOpen()} onOpenChange={setInviteOpen} />
    </div>
  )
}
