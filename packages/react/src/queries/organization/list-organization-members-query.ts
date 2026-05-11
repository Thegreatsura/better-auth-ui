import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions,
  useQuery
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

export type ListOrganizationMembersData<
  TAuthClient extends OrganizationAuthClient
> = InferData<TAuthClient["organization"]["listMembers"]>

export type ListOrganizationMembersParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["listMembers"]>[0]

export type ListOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof listOrganizationMembersOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

export function listOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) {
  type TData = ListOrganizationMembersData<TAuthClient>
  const queryKey = organizationQueryKeys.members(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.organization.listMembers({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export const ensureListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  queryClient.ensureQueryData(
    listOrganizationMembersOptions(authClient, userId, params)
  )

export const prefetchListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  queryClient.prefetchQuery(
    listOrganizationMembersOptions(authClient, userId, params)
  )

export const fetchListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  queryClient.fetchQuery(
    listOrganizationMembersOptions(authClient, userId, params)
  )

export type UseListOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient
> = ListOrganizationMembersOptions<TAuthClient> &
  ListOrganizationMembersParams<TAuthClient>

export function useListOrganizationMembers<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options: UseListOrganizationMembersOptions<TAuthClient> = {} as UseListOrganizationMembersOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptionsRest } = options

  const baseOptions = listOrganizationMembersOptions(authClient, userId, {
    query,
    fetchOptions
  } as ListOrganizationMembersParams<TAuthClient>)

  return useQuery(
    {
      ...queryOptionsRest,
      ...baseOptions,
      queryFn: userId ? baseOptions.queryFn : undefined
    },
    queryClient
  )
}
