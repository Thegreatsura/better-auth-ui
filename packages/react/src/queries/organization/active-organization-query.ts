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

export type ActiveOrganizationData<TAuthClient extends OrganizationAuthClient> =
  InferData<TAuthClient["organization"]["getFullOrganization"]>

export type ActiveOrganizationParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["getFullOrganization"]>[0]

export type ActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof activeOrganizationOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

export function activeOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ActiveOrganizationParams<TAuthClient>
) {
  type TData = ActiveOrganizationData<TAuthClient>
  const queryKey = organizationQueryKeys.activeOrganization(
    userId,
    params?.query
  )

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

export const ensureActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ActiveOrganizationParams<TAuthClient>
) =>
  queryClient.ensureQueryData(
    activeOrganizationOptions(authClient, userId, params)
  )

export const prefetchActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ActiveOrganizationParams<TAuthClient>
) =>
  queryClient.prefetchQuery(
    activeOrganizationOptions(authClient, userId, params)
  )

export const fetchActiveOrganization = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ActiveOrganizationParams<TAuthClient>
) =>
  queryClient.fetchQuery(activeOrganizationOptions(authClient, userId, params))

export type UseActiveOrganizationOptions<
  TAuthClient extends OrganizationAuthClient
> = ActiveOrganizationOptions<TAuthClient> &
  ActiveOrganizationParams<TAuthClient>

export function useActiveOrganization<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options: UseActiveOrganizationOptions<TAuthClient> = {} as UseActiveOrganizationOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptionsRest } = options

  const baseOptions = activeOrganizationOptions(authClient, userId, {
    query,
    fetchOptions
  } as ActiveOrganizationParams<TAuthClient>)

  return useQuery(
    {
      ...queryOptionsRest,
      ...baseOptions,
      queryFn: userId ? baseOptions.queryFn : skipToken
    },
    queryClient
  )
}
