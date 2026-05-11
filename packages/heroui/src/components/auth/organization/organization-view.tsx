import { useAuthPlugin } from "@better-auth-ui/react"
import { type AvatarProps, Chip, cn, Skeleton } from "@heroui/react"
import type { Organization } from "better-auth/client"
import type { ComponentProps } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationLogo } from "./organization-logo"

export type OrganizationViewProps = {
  className?: string
  isPending?: boolean
  size?: AvatarProps["size"]
  /**
   * When true, the slug line is omitted.
   */
  hideSlug?: boolean
  organization?: Organization & { role?: string }
}

/**
 * Compact organization row: logo, primary name, secondary slug — analogous to {@link UserView}.
 */
export function OrganizationView({
  className,
  isPending,
  size = "sm",
  hideSlug,
  organization,
  ...props
}: OrganizationViewProps & ComponentProps<"div">) {
  const { roles } = useAuthPlugin(organizationPlugin)

  if (isPending && !organization) {
    return (
      <div
        className={cn("flex min-w-0 items-center gap-2", className)}
        {...props}
      >
        <OrganizationLogo isPending size={size} />

        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-3.5 w-24 rounded-lg" />

          {!hideSlug && <Skeleton className="h-3 w-32 rounded-lg" />}
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
              {roles?.[organization.role] ?? organization.role}
            </Chip>
          ) : null}
        </div>

        {!hideSlug && (
          <p className="text-muted text-xs leading-tight truncate overflow-x-hidden font-mono">
            {slugDisplay}
          </p>
        )}
      </div>
    </div>
  )
}
