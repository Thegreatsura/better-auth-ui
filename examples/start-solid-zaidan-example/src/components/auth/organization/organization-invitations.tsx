import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useAuth, useListOrganizationInvitations } from "@better-auth-ui/solid"
import { ChevronUp, Filter, Search } from "lucide-solid"
import { createMemo, createSignal, For, type JSX, Show } from "solid-js"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@/lib/utils"
import { OrganizationInvitationRow } from "./organization-invitation-row"
import { OrganizationInvitationRowSkeleton } from "./organization-invitation-row-skeleton"
import { OrganizationInvitationsEmpty } from "./organization-invitations-empty"

export type OrganizationInvitationsProps = {
  class?: string
}

type RoleMap = Record<string, string>
type InvitationSort = "none" | "email" | "createdAt" | "role" | "status"
type InvitationSortColumn = Exclude<InvitationSort, "none">
type SortDirection = "ascending" | "descending"

type SortDescriptor = {
  column: InvitationSortColumn
  direction: SortDirection
}

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

function formatStatus(status?: string | null) {
  if (!status) return "Pending"

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function SortableTableHead(props: {
  children: JSX.Element
  onClick: () => void
  sortDirection?: SortDirection
}) {
  return (
    <TableHead aria-sort={props.sortDirection ?? "none"}>
      <button
        class="flex w-full items-center gap-2 text-left font-medium"
        onClick={props.onClick}
        type="button"
      >
        {props.children}
        <Show when={props.sortDirection}>
          <ChevronUp
            class={cn(
              "size-3 transition-transform duration-100 ease-out",
              props.sortDirection === "descending" && "rotate-180"
            )}
          />
        </Show>
      </button>
    </TableHead>
  )
}

export function OrganizationInvitations(props: OrganizationInvitationsProps) {
  const auth = useAuth()
  const [invitationSearch, setInvitationSearch] = createSignal("")
  const [invitationRoleFilter, setInvitationRoleFilter] = createSignal("all")
  const [invitationStatusFilter, setInvitationStatusFilter] =
    createSignal("all")
  const [invitationSort, setInvitationSort] =
    createSignal<InvitationSort>("none")
  const [sortDescriptor, setSortDescriptor] = createSignal<
    SortDescriptor | undefined
  >()
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
    let comparison = 0

    if (invitationSort() === "email") {
      comparison = (first.email ?? "").localeCompare(second.email ?? "")
    }

    if (invitationSort() === "createdAt") {
      comparison = invitationDateTime(first) - invitationDateTime(second)
    }

    if (invitationSort() === "role") {
      const firstRole = roles()[first.role ?? ""] ?? first.role ?? ""
      const secondRole = roles()[second.role ?? ""] ?? second.role ?? ""

      comparison = firstRole.localeCompare(secondRole)
    }

    if (invitationSort() === "status") {
      comparison = formatStatus(first.status).localeCompare(
        formatStatus(second.status)
      )
    }

    return sortDescriptor()?.direction === "descending"
      ? comparison * -1
      : comparison
  }
  const sortedInvitationRows = () =>
    [...filteredInvitationRows()].sort(sortInvitations)
  const toggleSort = (column: InvitationSortColumn) => {
    setInvitationSort(column)
    setSortDescriptor((current) => {
      if (current?.column !== column) {
        return { column, direction: "ascending" }
      }

      return {
        column,
        direction:
          current.direction === "ascending" ? "descending" : "ascending"
      }
    })
  }

  return (
    <Card class={props.class}>
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
            <Table>
              <TableBody>
                <OrganizationInvitationRowSkeleton />
                <OrganizationInvitationRowSkeleton />
              </TableBody>
            </Table>
          }
        >
          <Show
            when={invitationRows().length > 0}
            fallback={
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <OrganizationInvitationsEmpty />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            }
          >
            <div class="grid gap-4">
              <div class="flex flex-col gap-2 sm:flex-row">
                <InputGroup class="min-w-0 flex-1">
                  <InputGroupAddon>
                    <Search class="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label={localization().search}
                    onInput={(event) =>
                      setInvitationSearch(event.currentTarget.value)
                    }
                    placeholder={localization().search}
                    value={invitationSearch()}
                  />
                </InputGroup>
                <div class="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger as={Button} class="" variant="outline">
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
                    <DropdownMenuTrigger as={Button} class="" variant="outline">
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
              <Table aria-label="Invitations">
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      onClick={() => toggleSort("email")}
                      sortDirection={
                        sortDescriptor()?.column === "email"
                          ? sortDescriptor()?.direction
                          : undefined
                      }
                    >
                      Email
                    </SortableTableHead>
                    <SortableTableHead
                      onClick={() => toggleSort("createdAt")}
                      sortDirection={
                        sortDescriptor()?.column === "createdAt"
                          ? sortDescriptor()?.direction
                          : undefined
                      }
                    >
                      Invited
                    </SortableTableHead>
                    <SortableTableHead
                      onClick={() => toggleSort("role")}
                      sortDirection={
                        sortDescriptor()?.column === "role"
                          ? sortDescriptor()?.direction
                          : undefined
                      }
                    >
                      {localization().role}
                    </SortableTableHead>
                    <SortableTableHead
                      onClick={() => toggleSort("status")}
                      sortDirection={
                        sortDescriptor()?.column === "status"
                          ? sortDescriptor()?.direction
                          : undefined
                      }
                    >
                      {localization().status}
                    </SortableTableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Show
                    when={filteredInvitationRows().length > 0}
                    fallback={
                      <TableRow>
                        <TableCell
                          class="text-muted-foreground text-sm"
                          colSpan={5}
                        >
                          No invitations match the current filters.
                        </TableCell>
                      </TableRow>
                    }
                  >
                    <For each={sortedInvitationRows()}>
                      {(invitation) => (
                        <OrganizationInvitationRow
                          invitation={invitation}
                          roles={roles()}
                        />
                      )}
                    </For>
                  </Show>
                </TableBody>
              </Table>
            </div>
          </Show>
        </Show>
      </CardContent>
    </Card>
  )
}
