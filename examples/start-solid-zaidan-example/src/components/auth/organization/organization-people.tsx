import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useAuth, useListOrganizationMembers } from "@better-auth-ui/solid"
import { For, Show } from "solid-js"
import { UserView } from "@/components/auth/user/user-view"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

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

function formatRole(role?: string | null) {
  if (!role) return "Member"

  return role.charAt(0).toUpperCase() + role.slice(1)
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

export function OrganizationPeople(props: OrganizationPeopleProps) {
  const auth = useAuth()
  const members = useListOrganizationMembers(
    auth.authClient as OrganizationAuthClient
  )
  const memberRows = () => (members.data?.members ?? []) as OrganizationMember[]

  return (
    <div class={cn("grid gap-4 md:gap-6", props.class)}>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            View the members of the active organization.
          </CardDescription>
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
            Invitation APIs are available from @better-auth-ui/solid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            The invitations table UI remains deferred. Future slices can add
            invite, cancel, search, filters, and status UI here without changing
            the route contract.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
