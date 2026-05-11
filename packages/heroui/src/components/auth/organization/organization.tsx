import type { OrganizationView } from "@better-auth-ui/core"
import {
  type OrganizationAuthClient,
  useAuth,
  useAuthenticate,
  useAuthPlugin,
  useGetActiveOrganization
} from "@better-auth-ui/react"
import { type CardProps, cn, Tabs } from "@heroui/react"
import { type ComponentProps, useEffect, useMemo } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationMembers } from "./organization-members"
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
 * members / invitations. Path segments come from
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

  const { data: activeOrganizationData, isFetched } = useGetActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const hasActiveOrganization = Boolean(
    activeOrganizationData &&
      typeof activeOrganizationData === "object" &&
      "id" in activeOrganizationData &&
      (activeOrganizationData as { id: string }).id
  )

  const organizationsSettingsSegment = useMemo(
    () =>
      organizationPluginViewPaths.settings?.organizations ?? "organizations",
    [organizationPluginViewPaths.settings?.organizations]
  )

  useEffect(() => {
    if (!isFetched) return
    if (!hasActiveOrganization) {
      navigate({
        to: `${basePaths.settings}/${organizationsSettingsSegment}`,
        replace: true
      })
    }
  }, [
    basePaths.settings,
    hasActiveOrganization,
    isFetched,
    navigate,
    organizationsSettingsSegment
  ])

  const organizationRouteSegments = useMemo(() => {
    const contributed = organizationPluginViewPaths.organization
    return {
      settings: contributed?.settings ?? "settings",
      members: contributed?.members ?? "members"
    }
  }, [organizationPluginViewPaths.organization])

  const organizationPathViews = useMemo((): Record<
    string,
    OrganizationView
  > => {
    return {
      [organizationRouteSegments.settings]: "settings",
      [organizationRouteSegments.members]: "members"
    }
  }, [organizationRouteSegments.members, organizationRouteSegments.settings])

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
            aria-label={organizationLocalization.organizationSettings}
            className="w-fit overflow-auto"
          >
            <Tabs.Tab
              id="settings"
              href={`${basePaths.organization}/${organizationRouteSegments.settings}`}
            >
              {localization.settings.settings}

              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab
              id="members"
              href={`${basePaths.organization}/${organizationRouteSegments.members}`}
            >
              {organizationLocalization.members}

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

      <Tabs.Panel id="members" className="px-0">
        <div className="flex flex-col gap-4 md:gap-6">
          <OrganizationMembers />
        </div>
      </Tabs.Panel>
    </Tabs>
  )
}
