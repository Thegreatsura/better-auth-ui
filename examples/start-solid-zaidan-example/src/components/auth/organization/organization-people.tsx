import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useAuth,
  useListOrganizationInvitations,
  useListOrganizationMembers
} from "@better-auth-ui/solid"
import { PlusCircle } from "lucide-solid"
import { createSignal, For, Show } from "solid-js"
import { UserView } from "@/components/auth/user/user-view"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { InviteMemberDialog } from "./invite-member-dialog"

export type OrganizationPeopleProps = {
  class?: string
}

type OrganizationMember = {
  id: string
  role?: string | null
  user?: {
    email?: string | null
    image?: string | null
    name?: string | null
  } | null
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

function OrganizationMemberRow(props: { member: OrganizationMember }) {
  const user = () => props.member.user

  return (
    <div class="flex items-center justify-between gap-4 rounded-md border p-3">
      <UserView
        image={user()?.image}
        label={user()?.name ?? user()?.email ?? "Member"}
        secondaryLabel={user()?.email}
      />
      <span class="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
        {formatRole(props.member.role)}
      </span>
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
  const members = useListOrganizationMembers(
    auth.authClient as OrganizationAuthClient
  )
  const invitations = useListOrganizationInvitations(
    auth.authClient as OrganizationAuthClient
  )
  const memberRows = () => (members.data?.members ?? []) as OrganizationMember[]
  const invitationRows = () =>
    (invitations.data ?? []) as OrganizationInvitation[]

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
                  {(member) => <OrganizationMemberRow member={member} />}
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
