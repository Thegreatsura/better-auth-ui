import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions,
  skipToken,
  useQuery
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

export type GetActiveOrganizationData<
  TAuthClient extends OrganizationAuthClient
> = InferData<TAuthClient["organization"]["getFullOrganization"]>

export type GetActiveOrganizationParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["getFullOrganization"]>[0]

export type GetActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof getActiveOrganizationOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

export function getActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: GetActiveOrganizationParams<TAuthClient>
) {
  type TData = GetActiveOrganizationData<TAuthClient>
  const queryKey = organizationQueryKeys.getActive(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.organization.getFullOrganization({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export const ensureGetActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: GetActiveOrganizationParams<TAuthClient>
) =>
  queryClient.ensureQueryData(
    getActiveOrganizationOptions(authClient, userId, params)
  )

export const prefetchGetActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: GetActiveOrganizationParams<TAuthClient>
) =>
  queryClient.prefetchQuery(
    getActiveOrganizationOptions(authClient, userId, params)
  )

export const fetchGetActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: GetActiveOrganizationParams<TAuthClient>
) =>
  queryClient.fetchQuery(
    getActiveOrganizationOptions(authClient, userId, params)
  )

export type UseGetActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = GetActiveOrganizationOptions<TAuthClient> &
  GetActiveOrganizationParams<TAuthClient>

export function useGetActiveOrganization<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options: UseGetActiveOrganizationOptions<TAuthClient> = {} as UseGetActiveOrganizationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptionsRest } = options

  const baseOptions = getActiveOrganizationOptions(authClient, userId, {
    query,
    fetchOptions
  } as GetActiveOrganizationParams<TAuthClient>)

  return useQuery(
    {
      ...queryOptionsRest,
      ...baseOptions,
      queryFn: userId ? baseOptions.queryFn : skipToken
    },
    queryClient
  )
}
