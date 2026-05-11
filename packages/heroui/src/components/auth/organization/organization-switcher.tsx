import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useGetActiveOrganization,
  useListOrganizations,
  useSession,
  useSetActiveOrganization
} from "@better-auth-ui/react"
import {
  Briefcase,
  ChevronsExpandVertical,
  CirclePlus,
  Gear
} from "@gravity-ui/icons"
import {
  Button,
  type ButtonProps,
  cn,
  Dropdown,
  type DropdownPopoverProps,
  Label,
  Link
} from "@heroui/react"
import { buttonVariants } from "@heroui/styles"
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
  const { authClient, basePaths, localization, viewPaths } = useAuth()
  const { data: session, isPending: sessionPending } = useSession(authClient)
  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useGetActiveOrganization(authClient as OrganizationAuthClient)

  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations(authClient as OrganizationAuthClient)

  const { mutate: setActiveOrganization, isPending: setActivePending } =
    useSetActiveOrganization(authClient as OrganizationAuthClient)

  const isPending =
    sessionPending ||
    (session &&
      (organizationsPending || activeOrganizationPending || setActivePending))

  const otherOrganizations = organizations?.filter(
    (organization) => organization.id !== activeOrganization?.id
  )

  const [createOpen, setCreateOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <Dropdown isOpen={dropdownOpen} onOpenChange={setDropdownOpen}>
        <Button
          variant={variant}
          className={cn(
            "h-auto justify-start px-3 py-2 text-left font-normal",
            className
          )}
          isDisabled={!session && !sessionPending}
        >
          {isPending ? (
            <OrganizationView isPending showSlug={false} />
          ) : activeOrganization ? (
            <OrganizationView
              showSlug={false}
              organization={activeOrganization}
            />
          ) : session ? (
            <UserView showSubtitle={false} />
          ) : (
            <>
              <UserAvatar fallback={<Briefcase />} />

              <p className="text-sm font-medium">
                {organizationLocalization.organization}
              </p>
            </>
          )}

          <ChevronsExpandVertical className="ml-auto size-3.5 shrink-0" />
        </Button>

        <Dropdown.Popover placement={placement}>
          {!isPending && activeOrganization ? (
            <div className="flex items-center px-4 py-3 gap-4">
              <OrganizationView
                showSlug={false}
                className="min-w-0 flex-1"
                organization={activeOrganization}
              />

              <Link
                href={`${basePaths.organization}/${organizationViewPaths.organization.settings}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0 gap-2"
                )}
                onPress={() => setDropdownOpen(false)}
              >
                <Gear className="text-muted" />

                {organizationLocalization.manageOrganization}
              </Link>
            </div>
          ) : !isPending && session?.user && !activeOrganization ? (
            <div className="flex items-center px-4 py-3 gap-4">
              <UserView
                className="min-w-0 flex-1"
                showSubtitle={false}
                size="sm"
              />

              <Link
                href={`${basePaths.settings}/${viewPaths.settings.account}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0 gap-2"
                )}
                onPress={() => setDropdownOpen(false)}
              >
                <Gear className="text-muted" />

                {localization.settings.settings}
              </Link>
            </div>
          ) : null}

          <Dropdown.Menu>
            {activeOrganization ? (
              <Dropdown.Item
                textValue={organizationLocalization.personalAccount}
                onPress={() => setActiveOrganization({ organizationId: null })}
              >
                <UserView showSubtitle={false} />
              </Dropdown.Item>
            ) : null}

            {otherOrganizations?.map((organization) => (
              <Dropdown.Item
                key={organization.id}
                textValue={organization.name}
                onPress={() =>
                  setActiveOrganization({ organizationId: organization.id })
                }
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
