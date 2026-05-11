import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useListOrganizationMembers } from "../../queries/organization/list-organization-members-query"

export type UpdateMemberRoleParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["updateMemberRole"]>[0]

export type UpdateMemberRoleOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof updateMemberRoleOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function updateMemberRoleOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.updateMemberRole

  const mutationFn = (params: UpdateMemberRoleParams<TAuthClient>) =>
    authClient.organization.updateMemberRole({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    Parameters<typeof mutationFn>[0]
  >({
    mutationKey,
    mutationFn
  })
}

export function useUpdateMemberRole<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: UpdateMemberRoleOptions<TAuthClient>
) {
  const { refetch } = useListOrganizationMembers(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...updateMemberRoleOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
