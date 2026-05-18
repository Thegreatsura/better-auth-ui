import type { OrganizationView } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthenticate,
  useAuthPlugin
} from "@better-auth-ui/react"
import { Gear, Person } from "@gravity-ui/icons"
import { type CardProps, cn, Tabs } from "@heroui/react"
import { type ComponentProps, useEffect, useMemo } from "react"
import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationPeople } from "./organization-people"
import { OrganizationProfile } from "./organization-profile"

export type OrganizationProps = {
  className?: string
  hideNav?: boolean
  path?: string
  variant?: CardProps["variant"]
  /** @remarks `OrganizationView` */
  view?: OrganizationView
}

/**
 * Organization management shell: tabs for profile / danger zone and for
 * people (members / invitations). Path segments come from
 * `useAuthPlugin(organizationPlugin).viewPaths.organization`.
 */
export function Organization({
  className,
  hideNav,
  path,
  variant,
  view,
  ...props
}: OrganizationProps & ComponentProps<"div">) {
  const { authClient, basePaths, localization, navigate } = useAuth()
  useAuthenticate(authClient)

  const {
    localization: organizationLocalization,
    viewPaths: organizationPluginViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganization, isFetched } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const hasActiveOrganization = Boolean(
    activeOrganization &&
      typeof activeOrganization === "object" &&
      "id" in activeOrganization &&
      (activeOrganization as { id: string }).id
  )

  useEffect(() => {
    if (!isFetched) return
    if (!hasActiveOrganization) {
      navigate({
        to: `${basePaths.settings}/${organizationPluginViewPaths.settings?.organizations}`,
        replace: true
      })
    }
  }, [
    basePaths.settings,
    hasActiveOrganization,
    isFetched,
    navigate,
    organizationPluginViewPaths.settings?.organizations
  ])

  const organizationRouteSegments = useMemo(() => {
    const contributed = organizationPluginViewPaths.organization
    return {
      settings: contributed?.settings ?? "settings",
      people: contributed?.people ?? "people"
    }
  }, [organizationPluginViewPaths.organization])

  const organizationPathViews = useMemo((): Record<
    string,
    OrganizationView
  > => {
    return {
      [organizationRouteSegments.settings]: "settings",
      [organizationRouteSegments.people]: "people"
    }
  }, [organizationRouteSegments.people, organizationRouteSegments.settings])

  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const currentView = view ?? (path ? organizationPathViews[path] : undefined)

  if (!isFetched || !hasActiveOrganization) {
    return null
  }

  return (
    <Tabs
      className={cn(className)}
      orientation="horizontal"
      selectedKey={currentView}
      {...props}
    >
      {!hideNav && (
        <Tabs.ListContainer>
          <Tabs.List
            aria-label={localization.settings.settings}
            className="w-fit overflow-auto"
          >
            <Tabs.Tab
              id="settings"
              href={`${basePaths.organization}/${organizationRouteSegments.settings}`}
              className="gap-2"
            >
              <Gear className="text-muted" />

              {localization.settings.settings}

              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab
              id="people"
              href={`${basePaths.organization}/${organizationRouteSegments.people}`}
              className="gap-2"
            >
              <Person className="text-muted" />

              {organizationLocalization.people}

              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      )}

      <Tabs.Panel id="settings" className="px-0">
        <div className="flex flex-col gap-4 md:gap-6">
          <OrganizationProfile variant={variant} />

          <OrganizationDangerZone variant={variant} />
        </div>
      </Tabs.Panel>

      <Tabs.Panel id="people" className="px-0">
        <div className="flex flex-col gap-4 md:gap-6">
          <OrganizationPeople />
        </div>
      </Tabs.Panel>
    </Tabs>
  )
}
