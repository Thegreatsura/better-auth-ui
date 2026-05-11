import {
  organizationMutationKeys,
  organizationQueryKeys
} from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"

export type AcceptInvitationParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["acceptInvitation"]>[0]

export type AcceptInvitationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof acceptInvitationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function acceptInvitationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.acceptInvitation

  const mutationFn = (params: AcceptInvitationParams<TAuthClient>) =>
    authClient.organization.acceptInvitation({
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

export function useAcceptInvitation<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options?: AcceptInvitationOptions<TAuthClient>
) {
  const queryClient = useQueryClient()
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  return useMutation({
    ...acceptInvitationOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      if (userId) {
        const prefix = organizationQueryKeys.user(userId)
        await queryClient.invalidateQueries({
          queryKey: [...prefix, "listInvitations"]
        })
        await queryClient.invalidateQueries({
          queryKey: [...prefix, "listUserInvitations"]
        })
        await queryClient.invalidateQueries({
          queryKey: [...prefix, "listOrganizations"]
        })
      }
      await options?.onSuccess?.(...args)
    }
  })
}
