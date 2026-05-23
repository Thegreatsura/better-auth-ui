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
import { type ReactNode, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { UserView } from "../user/user-view"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationView } from "./organization-view"

/** Props for the {@link OrganizationSwitcher} component. */
export type OrganizationSwitcherProps = {
  className?: string
  placement?: DropdownPopoverProps["placement"]
  variant?: ButtonProps["variant"]
  trigger?: ReactNode
  hideCreate?: boolean
  hidePersonal?: boolean
  hideSettings?: boolean
}

/**
 * Renders an organizations dropdown with a trigger button,
 * header summary, and a menu of organizations to switch to.
 */
export function OrganizationSwitcher({
  className,
  hideCreate,
  hidePersonal,
  hideSettings,
  placement,
  variant = "ghost",
  size = "md",
  trigger,
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
    (!!session && (organizationsPending || activeOrganizationPending))

  const [createOpen, setCreateOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <Dropdown isOpen={dropdownOpen} onOpenChange={setDropdownOpen}>
        {trigger ? (
          <Dropdown.Trigger>{trigger}</Dropdown.Trigger>
        ) : (
          <Button
            variant={variant}
            className={cn("h-auto px-2 py-2", className)}
            isDisabled={!session || isPending}
            {...props}
          >
            {isPending ? (
              <OrganizationView size={size} isPending hideRole hideSlug />
            ) : activeOrganization ? (
              <OrganizationView size={size} hideRole hideSlug />
            ) : session && !hidePersonal ? (
              <UserView size={size} hideSubtitle />
            ) : (
              <OrganizationView
                size={size}
                hideRole
                hideSlug
                organization={{
                  name: organizationLocalization.organization
                }}
              />
            )}

            <ChevronsExpandVertical className="size-3 shrink-0 text-muted" />
          </Button>
        )}

        <Dropdown.Popover placement={placement} className="max-w-svw">
          {activeOrganization ? (
            <div className="flex items-center justify-between gap-4 px-4 pt-3">
              <OrganizationView
                hideRole
                hideSlug
                organization={activeOrganization}
              />

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

            {organizations
              ?.filter(
                (organization) => organization.id !== activeOrganization?.id
              )
              ?.map((organization) => (
                <Dropdown.Item
                  key={organization.id}
                  textValue={organization.name}
                  onPress={() =>
                    setActiveOrganization({ organizationId: organization.id })
                  }
                >
                  <OrganizationView
                    hideRole
                    hideSlug
                    organization={organization}
                  />
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
