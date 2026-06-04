import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useAuth,
  useListOrganizationMembers,
  useSession
} from "@better-auth-ui/solid"
import { ChevronUp, Filter, PlusCircle, Search } from "lucide-solid"
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
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"

export type OrganizationMembersProps = {
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
type MemberSort = "name" | "email" | "role"
type SortDirection = "ascending" | "descending"

type SortDescriptor = {
  column: MemberSort
  direction: SortDirection
}

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
  search: "Search...",
  clear: "Clear",
  all: "All",
  role: "Role",
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
  | "search"
  | "clear"
  | "all"
  | "role"
  | "member"
  | "admin"
  | "owner"
>

const fallbackRoles: RoleMap = {
  owner: fallbackLocalization.owner,
  admin: fallbackLocalization.admin,
  member: fallbackLocalization.member
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

export function OrganizationMembers(props: OrganizationMembersProps) {
  const auth = useAuth()
  const [inviteOpen, setInviteOpen] = createSignal(false)
  const [memberSearch, setMemberSearch] = createSignal("")
  const [memberRoleFilter, setMemberRoleFilter] = createSignal("all")
  const [memberSort, setMemberSort] = createSignal<MemberSort>("name")
  const [sortDescriptor, setSortDescriptor] = createSignal<SortDescriptor>({
    column: "name",
    direction: "ascending"
  })
  const session = useSession(auth.authClient)
  const members = useListOrganizationMembers(
    auth.authClient as OrganizationAuthClient
  )
  const memberRows = () => (members.data?.members ?? []) as OrganizationMember[]
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
            | "search"
            | "clear"
            | "all"
            | "role"
            | "member"
          >
          roles?: RoleMap
        }
      | undefined
  const localization = () =>
    organizationPluginConfig()?.localization ?? fallbackLocalization
  const roles = createMemo(
    () => organizationPluginConfig()?.roles ?? fallbackRoles
  )
  const normalizedMemberSearch = () => memberSearch().trim().toLowerCase()
  const filteredMemberRows = () =>
    memberRows().filter((member) => {
      const roleMatches =
        memberRoleFilter() === "all" || member.role === memberRoleFilter()
      const search = normalizedMemberSearch()

      if (!search) return roleMatches

      const searchableMember = [
        member.user?.name,
        member.user?.email,
        member.role
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return roleMatches && searchableMember.includes(search)
    })
  const sortMembers = (
    first: OrganizationMember,
    second: OrganizationMember
  ) => {
    let comparison = 0

    if (memberSort() === "role") {
      const firstRole = roles()[first.role ?? ""] ?? first.role ?? ""
      const secondRole = roles()[second.role ?? ""] ?? second.role ?? ""

      comparison = firstRole.localeCompare(secondRole)
    }

    if (memberSort() === "email") {
      const firstEmail = first.user?.email ?? first.user?.name ?? ""
      const secondEmail = second.user?.email ?? second.user?.name ?? ""

      comparison = firstEmail.localeCompare(secondEmail)
    }

    if (memberSort() === "name") {
      const firstName = first.user?.name ?? first.user?.email ?? ""
      const secondName = second.user?.name ?? second.user?.email ?? ""

      comparison = firstName.localeCompare(secondName)
    }

    return sortDescriptor().direction === "descending"
      ? comparison * -1
      : comparison
  }
  const sortedMemberRows = () => [...filteredMemberRows()].sort(sortMembers)
  const toggleSort = (column: MemberSort) => {
    setMemberSort(column)
    setSortDescriptor((current) => {
      if (current.column !== column) {
        return { column, direction: "ascending" }
      }

      return {
        column,
        direction:
          current.direction === "ascending" ? "descending" : "ascending"
      }
    })
  }
  const isOwner = () =>
    memberRows().some(
      (member) =>
        member.role === "owner" && member.userId === session.data?.user.id
    )

  return (
    <Card class={props.class}>
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
            <Table>
              <TableBody>
                <OrganizationMemberRowSkeleton />
                <OrganizationMemberRowSkeleton />
              </TableBody>
            </Table>
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
            <div class="grid gap-4">
              <div class="flex flex-col gap-2 sm:flex-row">
                <InputGroup class="min-w-0 flex-1">
                  <InputGroupAddon>
                    <Search class="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label={localization().search}
                    onInput={(event) =>
                      setMemberSearch(event.currentTarget.value)
                    }
                    placeholder={localization().search}
                    value={memberSearch()}
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
                        onChange={setMemberRoleFilter}
                        value={memberRoleFilter()}
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
                  <Show when={memberSearch() || memberRoleFilter() !== "all"}>
                    <Button
                      onClick={() => {
                        setMemberSearch("")
                        setMemberRoleFilter("all")
                      }}
                      type="button"
                      variant="ghost"
                    >
                      {localization().clear}
                    </Button>
                  </Show>
                </div>
              </div>
              <Table aria-label="Members">
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      onClick={() => toggleSort("name")}
                      sortDirection={
                        sortDescriptor().column === "name"
                          ? sortDescriptor().direction
                          : undefined
                      }
                    >
                      {localization().member}
                    </SortableTableHead>
                    <SortableTableHead
                      onClick={() => toggleSort("email")}
                      sortDirection={
                        sortDescriptor().column === "email"
                          ? sortDescriptor().direction
                          : undefined
                      }
                    >
                      Email
                    </SortableTableHead>
                    <SortableTableHead
                      onClick={() => toggleSort("role")}
                      sortDirection={
                        sortDescriptor().column === "role"
                          ? sortDescriptor().direction
                          : undefined
                      }
                    >
                      {localization().role}
                    </SortableTableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Show
                    when={filteredMemberRows().length > 0}
                    fallback={
                      <TableRow>
                        <TableCell
                          class="text-muted-foreground text-sm"
                          colSpan={4}
                        >
                          No members match the current filters.
                        </TableCell>
                      </TableRow>
                    }
                  >
                    <For each={sortedMemberRows()}>
                      {(member) => (
                        <OrganizationMemberRow
                          isOwner={isOwner()}
                          localization={localization()}
                          member={member}
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
      <InviteMemberDialog open={inviteOpen()} onOpenChange={setInviteOpen} />
    </Card>
  )
}
