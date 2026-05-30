import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "../../lib/auth-client"
import { setActiveOrganizationMeta } from "./metadata"
import {
  createOrganizationMutationOptions,
  type OrganizationMutationOptions,
  useOrganizationMutation
} from "./utils"

export type SetActiveOrganizationParams<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["setActive"]>[0]

export type SetActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = OrganizationMutationOptions<TAuthClient["organization"]["setActive"]>

export function setActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  return createOrganizationMutationOptions(
    authClient.organization.setActive,
    organizationMutationKeys.setActive
  )
}

export function useSetActiveOrganization<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options?: SetActiveOrganizationOptions<TAuthClient>
) {
  return useOrganizationMutation(
    authClient,
    authClient.organization.setActive,
    organizationMutationKeys.setActive,
    setActiveOrganizationMeta,
    options
  )
}
