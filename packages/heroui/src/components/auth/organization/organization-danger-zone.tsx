import { useAuth } from "@better-auth-ui/react"
import { Card, type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { DeleteOrganization } from "./delete-organization"
import { LeaveOrganization } from "./leave-organization"

export type OrganizationDangerZoneProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Danger zone heading with {@link LeaveOrganization} and {@link DeleteOrganization}
 * for the active organization in a single card.
 */
export function OrganizationDangerZone({
  className,
  variant,
  ...props
}: OrganizationDangerZoneProps & ComponentProps<"div">) {
  const { localization } = useAuth()

  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      <h2 className={cn("mb-3 text-sm font-semibold text-danger")}>
        {localization.settings.dangerZone}
      </h2>

      <Card variant={variant}>
        <Card.Content className="gap-0">
          <LeaveOrganization />

          <div className="border-b border-dashed -mx-4 my-4" />

          <DeleteOrganization />
        </Card.Content>
      </Card>
    </div>
  )
}
