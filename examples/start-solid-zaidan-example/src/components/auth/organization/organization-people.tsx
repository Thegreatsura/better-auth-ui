import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useAuth,
  useCancelInvitation,
  useHasPermission,
  useListOrganizationInvitations
} from "@better-auth-ui/solid"
import { ArrowUpDown, Filter, Search, X } from "lucide-solid"
import { createMemo, createSignal, For, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@/lib/utils"
import { OrganizationMembers } from "./organization-members"

export type OrganizationPeopleProps = {
  class?: string
}

type RoleMap = Record<string, string>
type InvitationSort = "none" | "email" | "createdAt" | "role" | "status"

const fallbackLocalization = {
  search: "Search...",
  clear: "Clear",
  all: "All",
  role: "Role",
  status: "Status",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  canceled: "Canceled",
  member: "Member",
  admin: "Admin",
  owner: "Owner"
} satisfies Pick<
  OrganizationLocalization,
  | "search"
  | "clear"
  | "all"
  | "role"
  | "status"
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "member"
  | "admin"
  | "owner"
>

const invitationStatuses = [
  "pending",
  "accepted",
  "rejected",
  "canceled"
] as const

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
  const [invitationSearch, setInvitationSearch] = createSignal("")
  const [invitationRoleFilter, setInvitationRoleFilter] = createSignal("all")
  const [invitationStatusFilter, setInvitationStatusFilter] =
    createSignal("all")
  const [invitationSort, setInvitationSort] =
    createSignal<InvitationSort>("none")
  const invitations = useListOrganizationInvitations(
    auth.authClient as OrganizationAuthClient
  )
  const invitationRows = () =>
    (invitations.data ?? []) as OrganizationInvitation[]
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | {
          localization?: Pick<
            OrganizationLocalization,
            | "search"
            | "clear"
            | "all"
            | "role"
            | "status"
            | "pending"
            | "accepted"
            | "rejected"
            | "canceled"
          >
          roles?: RoleMap
        }
      | undefined
  const localization = () =>
    organizationPluginConfig()?.localization ?? fallbackLocalization
  const roles = createMemo(
    () => organizationPluginConfig()?.roles ?? fallbackRoles
  )
  const normalizedInvitationSearch = () =>
    invitationSearch().trim().toLowerCase()
  const filteredInvitationRows = () =>
    invitationRows().filter((invitation) => {
      const roleMatches =
        invitationRoleFilter() === "all" ||
        invitation.role === invitationRoleFilter()
      const statusMatches =
        invitationStatusFilter() === "all" ||
        invitation.status === invitationStatusFilter()
      const search = normalizedInvitationSearch()

      if (!search) return roleMatches && statusMatches

      return (
        roleMatches &&
        statusMatches &&
        (invitation.email?.toLowerCase().includes(search) ?? false)
      )
    })
  const invitationStatusLabel = (status: (typeof invitationStatuses)[number]) =>
    localization()[status] ?? formatStatus(status)
  const invitationDateTime = (invitation: OrganizationInvitation) => {
    if (!invitation.createdAt) return Number.POSITIVE_INFINITY

    const date =
      invitation.createdAt instanceof Date
        ? invitation.createdAt
        : new Date(invitation.createdAt)
    const time = date.getTime()

    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
  }
  const sortInvitations = (
    first: OrganizationInvitation,
    second: OrganizationInvitation
  ) => {
    if (invitationSort() === "email") {
      return (first.email ?? "").localeCompare(second.email ?? "")
    }

    if (invitationSort() === "createdAt") {
      return invitationDateTime(first) - invitationDateTime(second)
    }

    if (invitationSort() === "role") {
      const firstRole = roles()[first.role ?? ""] ?? first.role ?? ""
      const secondRole = roles()[second.role ?? ""] ?? second.role ?? ""

      return firstRole.localeCompare(secondRole)
    }

    if (invitationSort() === "status") {
      return formatStatus(first.status).localeCompare(
        formatStatus(second.status)
      )
    }

    return 0
  }
  const sortedInvitationRows = () =>
    [...filteredInvitationRows()].sort(sortInvitations)

  return (
    <div class={cn("grid gap-4 md:gap-6", props.class)}>
      <OrganizationMembers />

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
              <div class="grid gap-4">
                <div class="flex flex-col gap-2 sm:flex-row">
                  <div class="relative min-w-0 flex-1">
                    <Search class="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                    <Input
                      aria-label={localization().search}
                      class="pl-9"
                      onInput={(event) =>
                        setInvitationSearch(event.currentTarget.value)
                      }
                      placeholder={localization().search}
                      value={invitationSearch()}
                    />
                  </div>
                  <div class="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        as={Button}
                        class=""
                        variant="outline"
                      >
                        <Filter class="size-4" />
                        {localization().role}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          onChange={setInvitationRoleFilter}
                          value={invitationRoleFilter()}
                        >
                          <DropdownMenuRadioItem value="all">
                            {localization().all}
                          </DropdownMenuRadioItem>
                          <For each={Object.entries(roles())}>
                            {([role, label]) => (
                              <DropdownMenuRadioItem value={role}>
                                {label}
                              </DropdownMenuRadioItem>
                            )}
                          </For>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        as={Button}
                        class=""
                        variant="outline"
                      >
                        <Filter class="size-4" />
                        {localization().status}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          onChange={setInvitationStatusFilter}
                          value={invitationStatusFilter()}
                        >
                          <DropdownMenuRadioItem value="all">
                            {localization().all}
                          </DropdownMenuRadioItem>
                          <For each={invitationStatuses}>
                            {(status) => (
                              <DropdownMenuRadioItem value={status}>
                                {invitationStatusLabel(status)}
                              </DropdownMenuRadioItem>
                            )}
                          </For>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        as={Button}
                        class=""
                        variant="outline"
                      >
                        <ArrowUpDown class="size-4" />
                        Sort
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          onChange={(value) =>
                            setInvitationSort(value as InvitationSort)
                          }
                          value={invitationSort()}
                        >
                          <DropdownMenuRadioItem value="none">
                            {localization().all}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="email">
                            Email
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="createdAt">
                            Invited
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="role">
                            {localization().role}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="status">
                            {localization().status}
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Show
                      when={
                        invitationSearch() ||
                        invitationRoleFilter() !== "all" ||
                        invitationStatusFilter() !== "all"
                      }
                    >
                      <Button
                        onClick={() => {
                          setInvitationSearch("")
                          setInvitationRoleFilter("all")
                          setInvitationStatusFilter("all")
                        }}
                        type="button"
                        variant="ghost"
                      >
                        {localization().clear}
                      </Button>
                    </Show>
                  </div>
                </div>
                <Show
                  when={filteredInvitationRows().length > 0}
                  fallback={
                    <p class="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                      No invitations match the current filters.
                    </p>
                  }
                >
                  <div class="grid gap-2">
                    <For each={sortedInvitationRows()}>
                      {(invitation) => (
                        <OrganizationInvitationRow invitation={invitation} />
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </Show>
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}
