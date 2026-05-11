import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useSetActiveOrganization
} from "@better-auth-ui/react"
import { Gear } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationView } from "./organization-view"
import type { OrganizationsListItem } from "./organizations-list-item"

export type OrganizationRowProps = {
  organization: OrganizationsListItem
}

/**
 * Single organization row: logo and labels via {@link OrganizationView}, plus Manage.
 */
export function OrganizationRow({ organization }: OrganizationRowProps) {
  const { authClient, basePaths, navigate } = useAuth()
  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { mutateAsync: setActiveOrganization, isPending: isOpeningSettings } =
    useSetActiveOrganization(authClient as OrganizationAuthClient)

  const openOrganizationSettings = async () => {
    try {
      await setActiveOrganization({ organizationId: organization.id })
      const organizationSegments = organizationViewPaths.organization
      navigate({
        to: `${basePaths.organization}/${organizationSegments?.settings ?? "settings"}`
      })
    } catch {
      // Errors are surfaced by the global error handler.
    }
  }

  return (
    <div className="flex items-center gap-3">
      <OrganizationView
        className="min-w-0 flex-1"
        organization={organization}
      />

      <Button
        className="ml-auto shrink-0"
        variant="outline"
        size="sm"
        isPending={isOpeningSettings}
        onPress={() => {
          void openOrganizationSettings()
        }}
        aria-label={organizationLocalization.manageOrganization}
      >
        {isOpeningSettings ? <Spinner color="current" size="sm" /> : <Gear />}

        {organizationLocalization.manageOrganization}
      </Button>
    </div>
  )
}
