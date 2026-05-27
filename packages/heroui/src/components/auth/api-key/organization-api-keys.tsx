import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth
} from "@better-auth-ui/react"
import type { CardProps } from "@heroui/react"

import { ApiKeys } from "./api-keys"

export type OrganizationApiKeysProps = {
  className?: string
  variant?: CardProps["variant"]
}

/** {@link ApiKeys} scoped to the active organization. */
export function OrganizationApiKeys({
  className,
  variant
}: OrganizationApiKeysProps) {
  const { authClient } = useAuth()
  const { data: activeOrganization, isPending } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  return (
    <ApiKeys
      className={className}
      variant={variant}
      organizationId={activeOrganization?.id}
      isPending={isPending || !activeOrganization}
    />
  )
}
