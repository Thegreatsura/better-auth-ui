import {
  organizationMutationKeys,
  organizationQueryKeys
} from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  type QueryClient,
  useMutation
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"
import { useListOrganizations } from "../../queries/organization"

export type SetActiveOrganizationParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["setActive"]>[0]

export type SetActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof setActiveOrganizationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn" | "meta"
>

export function setActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.setActiveOrganization

  const mutationFn = (params: SetActiveOrganizationParams<TAuthClient>) =>
    authClient.organization.setActive({
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

export function useSetActiveOrganization<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options?: SetActiveOrganizationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id
  const { data: organizations } = useListOrganizations(
    authClient,
    undefined,
    queryClient
  )

  return useMutation(
    {
      ...setActiveOrganizationOptions(authClient),
      ...options,
      onMutate: async (variables, context) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({
          queryKey: organizationQueryKeys.activeOrganization(userId)
        })

        // Snapshot the previous value
        const previousOrganization = context.client.getQueryData(
          organizationQueryKeys.activeOrganization(userId)
        )

        // Optimistically update to the new value
        if (variables?.organizationId === null) {
          context.client.setQueryData(
            organizationQueryKeys.activeOrganization(userId),
            null
          )

          return { previousOrganization }
        }

        const newOrganization = organizations?.find(
          (organization) => organization.id === variables?.organizationId
        )

        if (newOrganization) {
          context.client.setQueryData(
            organizationQueryKeys.activeOrganization(userId),
            newOrganization
          )
        }

        // Return a result with the snapshotted value
        return { previousOrganization }
      },
      // If the mutation fails,
      // use the result returned from onMutate to roll back
      onError: (error, variables, onMutateResult, context) => {
        const previousOrganization = onMutateResult?.previousOrganization

        if (previousOrganization !== undefined && error.error) {
          context.client.setQueryData(
            organizationQueryKeys.activeOrganization(userId),
            previousOrganization
          )
        }

        return options?.onError?.(error, variables, onMutateResult, context)
      },
      // Always refetch after error or success:
      onSettled: async (data, error, variables, onMutateResult, context) => {
        await context.client.invalidateQueries({
          queryKey: organizationQueryKeys.activeOrganization(userId)
        })

        return options?.onSettled?.(
          data,
          error,
          variables,
          onMutateResult,
          context
        )
      }
    },
    queryClient
  )
}
