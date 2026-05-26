import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizationMembers,
  useSession
} from "@better-auth-ui/react"
import { ChevronUp, Funnel, Plus, Xmark } from "@gravity-ui/icons"
import {
  Button,
  Chip,
  cn,
  Dropdown,
  Label,
  SearchField,
  type SortDescriptor,
  Table
} from "@heroui/react"
import type { Member } from "better-auth/client"
import { type ComponentProps, type ReactNode, useMemo, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"

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
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: session } = useSession(authClient)
  const { data: membersData, isPending } = useListOrganizationMembers(
    authClient as OrganizationAuthClient
  )

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>()
  const [roleFilter, setRoleFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredMembers = useMemo(() => {
    return membersData?.members.filter(
      (member) =>
        (roleFilter === "all" || member.role === roleFilter) &&
        (member.user.name.toLowerCase().includes(search.toLowerCase()) ||
          member.user.email.toLowerCase().includes(search.toLowerCase()))
    )
  }, [search, membersData?.members, roleFilter])

  const sortedMembers = useMemo(() => {
    if (!sortDescriptor) return filteredMembers

    return filteredMembers?.sort((a, b) => {
      const col = sortDescriptor.column as keyof Member | "user"
      const first =
        col === "user" ? a.user.name || a.user.email : String(a[col])
      const second =
        col === "user" ? b.user.name || b.user.email : String(b[col])

      let cmp = first.localeCompare(second)
      if (sortDescriptor.direction === "descending") {
        cmp *= -1
      }

      return cmp
    })
  }, [sortDescriptor, filteredMembers])

  const [inviteOpen, setInviteOpen] = useState(false)

  const isOwner = membersData?.members.some(
    (member) => member.role === "owner" && member.userId === session?.user.id
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

          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <SearchField
            className="min-w-0"
            aria-label={organizationLocalization.search}
            value={search}
            onChange={setSearch}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                placeholder={organizationLocalization.search}
                className="sm:w-[200px]"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <Dropdown>
            <Button size="sm" variant="secondary">
              <Funnel />
              {organizationLocalization.role}
            </Button>

            <Dropdown.Popover>
              <Dropdown.Menu
                selectionMode="single"
                selectedKeys={new Set([roleFilter])}
                onSelectionChange={(keys) => {
                  const key = [...keys][0] as string | undefined
                  setRoleFilter(key ?? "all")
                }}
              >
                <Dropdown.Item
                  id="all"
                  textValue={organizationLocalization.all}
                >
                  <Label>{organizationLocalization.all}</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>

                {Object.entries(roles).map(([key, label]) => (
                  <Dropdown.Item key={key} id={key} textValue={label}>
                    <Label>{label}</Label>
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        {roleFilter !== "all" && (
          <Chip size="sm" variant="secondary" className="w-fit">
            <Chip.Label>
              {organizationLocalization.role}:{" "}
              <span className="capitalize">
                {roles?.[roleFilter] ?? roleFilter}
              </span>
            </Chip.Label>

            <button
              type="button"
              aria-label={organizationLocalization.clear}
              className="text-muted hover:text-foreground inline-flex cursor-pointer items-center"
              onClick={() => setRoleFilter("all")}
            >
              <Xmark className="size-3" />
            </button>
          </Chip>
        )}

        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={organizationLocalization.members}
              sortDescriptor={sortDescriptor}
              onSortChange={(descriptor) => {
                const shouldReset =
                  sortDescriptor?.column === descriptor.column &&
                  descriptor.direction === "ascending"
                setSortDescriptor(shouldReset ? undefined : descriptor)
              }}
            >
              <Table.Header>
                <Table.Column allowsSorting isRowHeader id="user">
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>
                      {organizationLocalization.member}
                    </SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column allowsSorting id="role">
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>
                      {organizationLocalization.role}
                    </SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column className="text-end">
                  {organizationLocalization.actions}
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {isPending ? (
                  <OrganizationMemberRowSkeleton />
                ) : (
                  sortedMembers?.map((member) => (
                    <OrganizationMemberRow
                      key={member.id}
                      member={member}
                      isOwner={isOwner}
                    />
                  ))
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <InviteMemberDialog isOpen={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function SortableColumnHeader({
  children,
  sortDirection
}: {
  children: ReactNode
  sortDirection?: "ascending" | "descending"
}) {
  return (
    <span className="flex items-center justify-between">
      {children}

      {!!sortDirection && (
        <ChevronUp
          className={cn(
            "size-3 transform transition-transform duration-100 ease-out",
            sortDirection === "descending" ? "rotate-180" : ""
          )}
        />
      )}
    </span>
  )
}
