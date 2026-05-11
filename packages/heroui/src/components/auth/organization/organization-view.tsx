import { useAuthPlugin } from "@better-auth-ui/react"
import { type AvatarProps, Chip, cn, Skeleton } from "@heroui/react"
import type { ComponentProps } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationLogo } from "./organization-logo"
import { localizedOrganizationRole } from "./organization-role-label"
import type { OrganizationsListItem } from "./organizations-list-item"

export type OrganizationViewProps = {
  className?: string
  isPending?: boolean
  size?: AvatarProps["size"]
  /**
   * When false, the slug line is omitted (e.g. organization switcher).
   * @default true
   */
  showSlug?: boolean
  /** When omitted while loading (`isPending`), a skeleton is shown. */
  organization?: Pick<
    OrganizationsListItem,
    "name" | "slug" | "logo" | "role"
  > | null
}

/**
 * Compact organization row: logo, primary name, secondary slug — analogous to {@link UserView}.
 */
export function OrganizationView({
  className,
  isPending,
  size = "sm",
  showSlug = true,
  organization,
  ...props
}: OrganizationViewProps & ComponentProps<"div">) {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  if (isPending && organization === undefined) {
    return (
      <div
        className={cn("flex min-w-0 items-center gap-2", className)}
        {...props}
      >
        <OrganizationLogo isOrganizationLoading size={size} />

        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-3.5 w-28 rounded-lg" />

          {showSlug ? <Skeleton className="h-3 w-36 rounded-lg" /> : null}
        </div>
      </div>
    )
  }

  const slugDisplay = organization?.slug?.trim() || "—"

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <OrganizationLogo organization={organization ?? undefined} size={size} />

      <div className="flex flex-col min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-foreground text-sm font-medium leading-tight truncate">
            {organization?.name}
          </p>

          {organization?.role ? (
            <Chip className="shrink-0" size="sm">
              {localizedOrganizationRole(
                organization.role,
                organizationLocalization
              )}
            </Chip>
          ) : null}
        </div>

        {showSlug ? (
          <p className="text-muted text-xs leading-tight truncate overflow-x-hidden font-mono">
            {slugDisplay}
          </p>
        ) : null}
      </div>
    </div>
  )
}
