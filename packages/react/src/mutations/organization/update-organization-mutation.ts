import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  type QueryClient,
  useMutation
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"
import {
  activeOrganizationOptions,
  fullOrganizationOptions,
  listOrganizationsOptions
} from "../../queries/organization"

export type UpdateOrganizationParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["update"]>[0]

export type UpdateOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof updateOrganizationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function updateOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.updateOrganization

  const mutationFn = (params: UpdateOrganizationParams<TAuthClient>) =>
    authClient.organization.update({
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

export function useUpdateOrganization<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options?: UpdateOrganizationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  return useMutation(
    {
      ...updateOrganizationOptions(authClient),
      ...options,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await Promise.all([
          context.client.invalidateQueries({
            queryKey: listOrganizationsOptions(authClient, userId).queryKey
          }),
          context.client.invalidateQueries({
            queryKey: activeOrganizationOptions(authClient, userId).queryKey
          }),
          context.client.invalidateQueries({
            queryKey: fullOrganizationOptions(authClient, userId, {
              query: { organizationId: data.id }
            }).queryKey
          })
        ])

        return options?.onSuccess?.(data, variables, onMutateResult, context)
      }
    },
    queryClient
  )
}
