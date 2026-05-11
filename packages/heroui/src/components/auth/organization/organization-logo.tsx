import { Briefcase } from "@gravity-ui/icons"
import { Avatar, type AvatarProps, cn, Skeleton } from "@heroui/react"
import type { ReactNode } from "react"

export type OrganizationLogoProps = {
  className?: string
  fallback?: ReactNode
  /**
   * When true and `organization` is still `undefined` (initial query), show a skeleton.
   */
  isOrganizationLoading?: boolean
  organization?: {
    name?: string | null
    logo?: string | null
  } | null
  size?: AvatarProps["size"]
}

/**
 * Renders an organization logo image, initials fallback, or a briefcase icon;
 * shows a circular skeleton while loading when `isOrganizationLoading` is set and `organization` is undefined.
 */
export function OrganizationLogo({
  className,
  fallback,
  isOrganizationLoading,
  organization,
  size = "sm",
  style,
  ...props
}: OrganizationLogoProps & AvatarProps) {
  if (isOrganizationLoading && organization === undefined) {
    return (
      <Skeleton
        className={cn(
          "rounded-full",
          size === "sm" ? "size-8" : size === "md" ? "size-10" : "size-12",
          className
        )}
        style={style}
      />
    )
  }

  const initials = organization?.name?.slice(0, 2).toUpperCase()

  return (
    <Avatar
      size={size}
      className={cn("rounded-full", className)}
      style={style}
      {...props}
    >
      <Avatar.Image
        alt={organization?.name ?? "Organization"}
        src={organization?.logo ?? undefined}
      />

      <Avatar.Fallback
        className={cn(
          size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm"
        )}
        delayMs={organization?.logo ? 600 : undefined}
      >
        {fallback || initials || <Briefcase className="size-4" />}
      </Avatar.Fallback>
    </Avatar>
  )
}
