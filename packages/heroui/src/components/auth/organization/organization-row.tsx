import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useSetActiveOrganization
} from "@better-auth-ui/react"
import { Gear } from "@gravity-ui/icons"
import { Button, Spinner } from "@heroui/react"
import type { Organization } from "better-auth/client"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationView } from "./organization-view"

export type OrganizationRowProps = {
  organization: Organization
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

  const { mutate: setActiveOrganization, isPending: setActivePending } =
    useSetActiveOrganization(authClient as OrganizationAuthClient, {
      onSuccess: () => {
        navigate({
          to: `${basePaths.organization}/${organizationViewPaths.organization.settings}`
        })
      }
    })

  return (
    <div className="flex items-center gap-3">
      <OrganizationView organization={organization} />

      <Button
        className="ml-auto shrink-0"
        variant="outline"
        size="sm"
        isPending={setActivePending}
        onPress={() =>
          setActiveOrganization({ organizationId: organization.id })
        }
        aria-label={organizationLocalization.manage}
      >
        {setActivePending ? <Spinner color="current" size="sm" /> : <Gear />}

        {organizationLocalization.manage}
      </Button>
    </div>
  )
}
