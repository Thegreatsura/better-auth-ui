import { organizationMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useListOrganizations } from "../../queries/organization/list-organizations-query"

export type CreateOrganizationParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["create"]>[0]

export type CreateOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof createOrganizationOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

export function createOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient) {
  const mutationKey = organizationMutationKeys.createOrganization

  const mutationFn = (params: CreateOrganizationParams<TAuthClient>) =>
    authClient.organization.create({
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

export function useCreateOrganization<
  TAuthClient extends OrganizationAuthClient
>(authClient: TAuthClient, options?: CreateOrganizationOptions<TAuthClient>) {
  const { refetch } = useListOrganizations(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...createOrganizationOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
