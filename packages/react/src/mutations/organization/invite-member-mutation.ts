import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useListOrganizationInvitations } from "../../queries/organization/list-organization-invitations-query"

export type InviteMemberParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["inviteMember"]>[0]

export type InviteMemberOptions<TAuthClient extends OrganizationAuthClient> =
  Omit<
    ReturnType<typeof inviteMemberOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

export function inviteMemberOptions<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = organizationMutationKeys.inviteMember

  const mutationFn = (params: InviteMemberParams<TAuthClient>) =>
    authClient.organization.inviteMember({
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

export function useInviteMember<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: InviteMemberOptions<TAuthClient>
) {
  const { refetch } = useListOrganizationInvitations(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...inviteMemberOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
