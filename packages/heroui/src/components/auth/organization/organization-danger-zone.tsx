import { useAuth } from "@better-auth-ui/react"
import { type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { DeleteOrganization } from "./delete-organization"

export type OrganizationDangerZoneProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Danger zone heading and {@link DeleteOrganization} for the active organization.
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

      <DeleteOrganization variant={variant} />
    </div>
  )
}
