import { type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationProfile } from "./organization-profile"

/** Props for the {@link OrganizationSettings} component. */
export type OrganizationSettingsProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Organization settings UI: profile card, then danger zone.
 */
export function OrganizationSettings({
  className,
  variant,
  ...props
}: OrganizationSettingsProps & ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)} {...props}>
      <OrganizationProfile variant={variant} />
      <OrganizationDangerZone variant={variant} />
    </div>
  )
}
