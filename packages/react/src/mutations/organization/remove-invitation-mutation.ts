import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  type QueryClient,
  useMutation
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"
import { listOrganizationInvitationsOptions } from "../../queries/organization"

export type RemoveInvitationParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["cancelInvitation"]>[0]

export type RemoveInvitationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof removeInvitationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function removeInvitationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.removeInvitation

  const mutationFn = (params: RemoveInvitationParams<TAuthClient>) =>
    authClient.organization.cancelInvitation({
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

export function useRemoveInvitation<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: RemoveInvitationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  return useMutation({
    ...removeInvitationOptions(authClient),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await context.client.invalidateQueries({
        queryKey: listOrganizationInvitationsOptions(authClient, userId, {
          query: { organizationId: data.organizationId }
        }).queryKey
      })

      return options?.onSuccess?.(data, variables, onMutateResult, context)
    }
  })
}
