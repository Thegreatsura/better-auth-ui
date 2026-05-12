import {
  organizationMutationKeys,
  organizationQueryKeys
} from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
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
  "mutationKey" | "mutationFn"
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
  options?: SetActiveOrganizationOptions<TAuthClient>
) {
  const { data: session } = useSession(authClient)
  const { data: organizations } = useListOrganizations(authClient)

  return useMutation({
    ...setActiveOrganizationOptions(authClient),
    ...options,
    onMutate: async (variables, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({
        queryKey: organizationQueryKeys.activeOrganization(session?.user.id)
      })

      // Snapshot the previous value
      const previousOrganization = context.client.getQueryData(
        organizationQueryKeys.activeOrganization(session?.user.id)
      )

      // Optimistically update to the new value
      if (variables?.organizationId === null) {
        context.client.setQueryData(
          organizationQueryKeys.activeOrganization(session?.user.id),
          null
        )

        return { previousOrganization }
      }

      const newOrganization = organizations?.find(
        (organization) => organization.id === variables?.organizationId
      )

      if (newOrganization) {
        context.client.setQueryData(
          organizationQueryKeys.activeOrganization(session?.user.id),
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

      if (previousOrganization) {
        context.client.setQueryData(
          organizationQueryKeys.activeOrganization(session?.user.id),
          previousOrganization
        )
      }

      return options?.onError?.(error, variables, onMutateResult, context)
    },
    // Always refetch after error or success:
    onSettled: async (data, error, variables, onMutateResult, context) => {
      await context.client.invalidateQueries({
        queryKey: organizationQueryKeys.activeOrganization(session?.user.id)
      })

      return options?.onSettled?.(
        data,
        error,
        variables,
        onMutateResult,
        context
      )
    }
  })
}
