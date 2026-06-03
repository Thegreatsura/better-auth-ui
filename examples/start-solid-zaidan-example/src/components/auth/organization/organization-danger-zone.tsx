import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import { useAuth } from "@better-auth-ui/solid"
import type { ComponentProps } from "solid-js"
import { Card, CardContent } from "@/components/ui/card"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@/lib/utils"
import { DeleteOrganization } from "./delete-organization"

export type OrganizationDangerZoneProps = ComponentProps<"div">

const fallbackLocalization = {
  deleteOrganization: "Delete organization",
  deleteOrganizationDescription:
    "Permanently delete this organization and all of its data. All members will lose access and this cannot be undone.",
  organizationDeleted: "Organization deleted"
} satisfies Pick<
  OrganizationLocalization,
  "deleteOrganization" | "deleteOrganizationDescription" | "organizationDeleted"
>

export function OrganizationDangerZone(props: OrganizationDangerZoneProps) {
  const auth = useAuth()
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | {
          localization?: Pick<
            OrganizationLocalization,
            | "deleteOrganization"
            | "deleteOrganizationDescription"
            | "organizationDeleted"
          >
        }
      | undefined
  const localization = () =>
    organizationPluginConfig()?.localization ?? fallbackLocalization

  return (
    <div class={cn("flex w-full flex-col", props.class)} {...props}>
      <h2 class="mb-3 font-semibold text-destructive text-sm">
        {auth.localization.settings.dangerZone}
      </h2>
      <Card>
        <CardContent>
          <DeleteOrganization localization={localization()} />
        </CardContent>
      </Card>
    </div>
  )
}
