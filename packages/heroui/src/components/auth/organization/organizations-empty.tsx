import { useAuthPlugin } from "@better-auth-ui/react"
import { Briefcase } from "@gravity-ui/icons"
import { Button } from "@heroui/react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

export type OrganizationsEmptyProps = {
  onCreatePress: () => void
}

export function OrganizationsEmpty({ onCreatePress }: OrganizationsEmptyProps) {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary">
        <Briefcase className="size-4.5" />
      </div>

      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-semibold">
          {organizationLocalization.noOrganizations}
        </p>

        <p className="text-muted text-xs">
          {organizationLocalization.organizationsDescription}
        </p>
      </div>

      <Button size="sm" onPress={onCreatePress}>
        {organizationLocalization.createOrganization}
      </Button>
    </div>
  )
}
