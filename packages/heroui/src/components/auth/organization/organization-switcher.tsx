import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin,
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
  Label,
  Link
} from "@heroui/react"
import { buttonVariants } from "@heroui/styles"
import { useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserView } from "../user/user-view"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationLogo } from "./organization-logo"
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
  hideCreate?: boolean
  hidePersonal?: boolean
  /** When true, hides the manage organization / account settings link in the popover header. */
  hideSettings?: boolean
}

/**
 * Renders an organization account dropdown, mirroring {@link UserButton} layout:
 * trigger button, header summary, and a menu of organizations to activate — with
 * “Create organization” as the final item. Does not support `size="icon"`.
 */
export function OrganizationSwitcher({
  className,
  hideCreate,
  hidePersonal,
  hideSettings,
  placement = "bottom",
  variant = "ghost",
  ...props
}: OrganizationSwitcherProps & ButtonProps) {
  const { authClient, basePaths, localization, viewPaths } = useAuth()
  const { data: session, isPending: sessionPending } = useSession(authClient)
  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useActiveOrganization(authClient as OrganizationAuthClient)

  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations(authClient as OrganizationAuthClient)

  const { mutate: setActiveOrganization } = useSetActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const isPending =
    sessionPending ||
    (session && (organizationsPending || activeOrganizationPending))

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
          {...props}
        >
          {isPending ? (
            <OrganizationView isPending hideSlug />
          ) : activeOrganization ? (
            <OrganizationView hideSlug organization={activeOrganization} />
          ) : session && !hidePersonal ? (
            <UserView hideSubtitle />
          ) : (
            <>
              <OrganizationLogo />

              <p className="text-sm font-medium">
                {organizationLocalization.organization}
              </p>
            </>
          )}

          <ChevronsExpandVertical className="ml-auto size-3.5 shrink-0" />
        </Button>

        <Dropdown.Popover placement={placement} className="max-w-svw">
          {activeOrganization ? (
            <div className="flex items-center justify-between gap-4 px-4 pt-3">
              <OrganizationView hideSlug organization={activeOrganization} />

              {!hideSettings && (
                <Link
                  href={`${basePaths.organization}/${organizationViewPaths.organization.settings}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "shrink-0 gap-2"
                  )}
                  onPress={() => setDropdownOpen(false)}
                >
                  <Gear className="text-muted" />

                  {organizationLocalization.manage}
                </Link>
              )}
            </div>
          ) : !isPending && session?.user && !hidePersonal ? (
            <div className="flex items-center justify-between gap-4 px-4 pt-3">
              <UserView hideSubtitle />

              {!hideSettings && (
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
              )}
            </div>
          ) : null}

          <Dropdown.Menu>
            {!!activeOrganization && !hidePersonal && (
              <Dropdown.Item
                textValue={organizationLocalization.personalAccount}
                onPress={() => setActiveOrganization({ organizationId: null })}
              >
                <UserView hideSubtitle />
              </Dropdown.Item>
            )}

            {otherOrganizations?.map((organization) => (
              <Dropdown.Item
                key={organization.id}
                textValue={organization.name}
                onPress={() =>
                  setActiveOrganization({ organizationId: organization.id })
                }
              >
                <OrganizationView hideSlug organization={organization} />
              </Dropdown.Item>
            ))}

            {!hideCreate && (
              <Dropdown.Item
                textValue={organizationLocalization.createOrganization}
                onPress={() => setCreateOpen(true)}
              >
                <CirclePlus className="text-muted" />

                <Label>{organizationLocalization.createOrganization}</Label>
              </Dropdown.Item>
            )}
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
