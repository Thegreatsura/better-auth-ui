import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  type QueryClient,
  useMutation
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"
import { listUserInvitationsOptions } from "../../queries/organization"

export type RejectInvitationParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["rejectInvitation"]>[0]

export type RejectInvitationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof rejectInvitationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function rejectInvitationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.rejectInvitation

  const mutationFn = (params: RejectInvitationParams<TAuthClient>) =>
    authClient.organization.rejectInvitation({
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

export function useRejectInvitation<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: RejectInvitationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  return useMutation(
    {
      ...rejectInvitationOptions(authClient),
      ...options,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await context.client.invalidateQueries({
          queryKey: listUserInvitationsOptions(authClient, userId).queryKey
        })

        return options?.onSuccess?.(data, variables, onMutateResult, context)
      }
    },
    queryClient
  )
}
