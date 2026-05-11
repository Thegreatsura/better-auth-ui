import { cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { Members } from "./members"
import { OrganizationInvitations } from "./organization-invitations"

/** Props for the {@link OrganizationMembers} component. */
export type OrganizationMembersProps = {
  className?: string
}

/**
 * Organization membership UI: members table (see {@link Members}), then org
 * invitations.
 */
export function OrganizationMembers({
  className,
  ...props
}: OrganizationMembersProps & ComponentProps<"div">) {
  return (
    <div className={cn("flex w-full flex-col gap-8", className)} {...props}>
      <Members />

      <OrganizationInvitations />
    </div>
  )
}

export { Members, type MembersProps } from "./members"
