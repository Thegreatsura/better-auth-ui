import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useGetActiveOrganization,
  useListOrganizations,
  useSession,
  useSetActiveOrganization
} from "@better-auth-ui/react"
import { ChevronsExpandVertical, CirclePlus, Gear } from "@gravity-ui/icons"
import {
  Button,
  type ButtonProps,
  cn,
  Dropdown,
  type DropdownPopoverProps,
  Label
} from "@heroui/react"
import { useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserAvatar } from "../user/user-avatar"
import { UserView } from "../user/user-view"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationView } from "./organization-view"

/** Props for the {@link OrganizationSwitcher} component. */
export type OrganizationSwitcherProps = {
  className?: string
  /**
   * The placement of the element with respect to its anchor element.
   * @default "bottom"
   */
  placement?: DropdownPopoverProps["placement"]
  variant?: ButtonProps["variant"]
}

type Organization = {
  id: string
  name: string
  slug?: string | null
  logo?: string | null
}

/**
 * Renders an organization account dropdown, mirroring {@link UserButton} layout:
 * trigger button, header summary, and a menu of organizations to activate — with
 * “Create organization” as the final item. Does not support `size="icon"`.
 */
export function OrganizationSwitcher({
  className,
  placement = "bottom",
  variant = "ghost"
}: OrganizationSwitcherProps) {
  const { authClient, basePaths, navigate } = useAuth()
  const { data: session, isPending: sessionPending } = useSession(authClient)
  const userId = session?.user.id
  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganizationData, isPending: activeOrganizationPending } =
    useGetActiveOrganization(authClient as OrganizationAuthClient)

  const { data: organizationsData, isPending: organizationsPending } =
    useListOrganizations(authClient as OrganizationAuthClient)

  /** Avoid showing "Personal" until we know the active org (list vs active resolve at different times). */
  const triggerPending =
    sessionPending ||
    (Boolean(userId) && (organizationsPending || activeOrganizationPending))

  const { mutateAsync: setActive } = useSetActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const activeOrganization = activeOrganizationData as
    | Organization
    | null
    | undefined

  const organizations = (organizationsData ?? []) as Organization[]

  const otherOrganizations = activeOrganization
    ? organizations.filter(
        (organization) => organization.id !== activeOrganization.id
      )
    : organizations

  const [createOpen, setCreateOpen] = useState(false)

  const openActiveOrganizationManage = () => {
    if (!activeOrganization) return
    const organizationSegments = organizationViewPaths.organization
    navigate({
      to: `${basePaths.organization}/${organizationSegments?.settings ?? "settings"}`
    })
  }

  return (
    <>
      <Dropdown>
        <Button
          variant={variant}
          className={cn(
            "h-auto justify-start px-3 py-2 text-left font-normal",
            className
          )}
        >
          {triggerPending ? (
            <OrganizationView
              isPending
              showSlug={false}
              className="min-w-0 flex-1"
            />
          ) : activeOrganization ? (
            <OrganizationView
              showSlug={false}
              className="min-w-0 flex-1"
              organization={activeOrganization}
            />
          ) : session ? (
            <UserView showSubtitle={false} size="sm" />
          ) : (
            <>
              <UserAvatar className="shrink-0" size="sm" />

              <p className="text-sm font-medium">
                {organizationLocalization.personalAccount}
              </p>
            </>
          )}

          <ChevronsExpandVertical className="ml-auto size-3.5 shrink-0" />
        </Button>

        <Dropdown.Popover
          placement={placement}
          className="min-w-40 max-w-[48svw] md:min-w-56"
        >
          {!triggerPending && activeOrganization ? (
            <div className="flex items-center gap-3 px-3 py-3.5 md:px-4 md:py-4">
              <OrganizationView
                showSlug={false}
                className="min-w-0 flex-1"
                organization={activeOrganization}
              />

              <Button
                className="shrink-0"
                size="sm"
                variant="outline"
                onPress={openActiveOrganizationManage}
              >
                <Gear className="text-muted" />

                {organizationLocalization.manageOrganization}
              </Button>
            </div>
          ) : !triggerPending && session?.user ? (
            <div className="px-3 py-3.5 md:px-4 md:py-4">
              <UserView className="min-w-0" showSubtitle={false} size="sm" />
            </div>
          ) : null}

          <Dropdown.Menu>
            <Dropdown.Item
              textValue={organizationLocalization.personalAccount}
              onPress={() => setActive({ organizationId: null })}
            >
              <UserView showSubtitle={false} />
            </Dropdown.Item>

            {otherOrganizations.map((organization) => (
              <Dropdown.Item
                key={organization.id}
                textValue={organization.name}
                onPress={() => setActive({ organizationId: organization.id })}
              >
                <OrganizationView
                  showSlug={false}
                  className="min-w-0 w-full"
                  organization={organization}
                  size="sm"
                />
              </Dropdown.Item>
            ))}

            <Dropdown.Item
              textValue={organizationLocalization.createOrganization}
              onPress={() => setCreateOpen(true)}
            >
              <CirclePlus className="text-muted" />

              <Label>{organizationLocalization.createOrganization}</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <CreateOrganizationDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  )
}
