import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useListOrganizationMembers } from "../../queries/organization/list-organization-members-query"

export type RemoveMemberParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["removeMember"]>[0]

export type RemoveMemberOptions<TAuthClient extends OrganizationAuthClient> =
  Omit<
    ReturnType<typeof removeMemberOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

export function removeMemberOptions<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = organizationMutationKeys.removeMember

  const mutationFn = (params: RemoveMemberParams<TAuthClient>) =>
    authClient.organization.removeMember({
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

export function useRemoveMember<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: RemoveMemberOptions<TAuthClient>
) {
  const { refetch } = useListOrganizationMembers(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...removeMemberOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
