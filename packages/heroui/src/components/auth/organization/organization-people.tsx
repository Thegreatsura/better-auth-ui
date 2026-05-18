import { cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { OrganizationInvitations } from "./organization-invitations"
import { OrganizationMembers } from "./organization-members"

/** Props for the {@link OrganizationPeople} component. */
export type OrganizationPeopleProps = {
  className?: string
}

/**
 * Organization people UI: members table (see {@link OrganizationMembers}), then org
 * invitations.
 */
export function OrganizationPeople({
  className,
  ...props
}: OrganizationPeopleProps & ComponentProps<"div">) {
  return (
    <div className={cn("flex w-full flex-col gap-8", className)} {...props}>
      <OrganizationMembers />

      <OrganizationInvitations />
    </div>
  )
}

export {
  OrganizationMembers,
  type OrganizationMembersProps
} from "./organization-members"
