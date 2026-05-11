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
>(authClient: TAuthClient, options?: UpdateOrganizationOptions<TAuthClient>) {
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const userId = session?.user.id
  const queryClient = useQueryClient()

  return useMutation({
    ...updateOrganizationOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: [...organizationQueryKeys.user(userId)]
        })
      }

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
