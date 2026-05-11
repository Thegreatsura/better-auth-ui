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

export type HasPermissionData<TAuthClient extends OrganizationAuthClient> =
  InferData<TAuthClient["organization"]["hasPermission"]>

export type HasPermissionParams<TAuthClient extends OrganizationAuthClient> =
  Parameters<TAuthClient["organization"]["hasPermission"]>[0]

export type HasPermissionOptions<TAuthClient extends OrganizationAuthClient> =
  Omit<
    ReturnType<typeof hasPermissionOptions<TAuthClient>>,
    "queryKey" | "queryFn"
  >

function hasPermissionKeyPayload<TAuthClient extends OrganizationAuthClient>(
  params?: HasPermissionParams<TAuthClient>
) {
  if (!params) return null
  const { fetchOptions: _fetchOptions, ...rest } = params
  return rest
}

export function hasPermissionOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: HasPermissionParams<TAuthClient>
) {
  type TData = HasPermissionData<TAuthClient>
  const queryKey = organizationQueryKeys.hasPermission(
    userId,
    hasPermissionKeyPayload(params)
  )

  const canFetch = Boolean(userId && params?.permissions)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: canFetch
        ? ({ signal }) =>
            authClient.organization.hasPermission({
              ...params,
              fetchOptions: { ...params?.fetchOptions, signal, throw: true }
            } as HasPermissionParams<TAuthClient>) as Promise<TData>
        : undefined
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export const ensureHasPermission = <TAuthClient extends OrganizationAuthClient>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: HasPermissionParams<TAuthClient>
) =>
  queryClient.ensureQueryData(hasPermissionOptions(authClient, userId, params))

export const prefetchHasPermission = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: HasPermissionParams<TAuthClient>
) => queryClient.prefetchQuery(hasPermissionOptions(authClient, userId, params))

export const fetchHasPermission = <TAuthClient extends OrganizationAuthClient>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: HasPermissionParams<TAuthClient>
) => queryClient.fetchQuery(hasPermissionOptions(authClient, userId, params))

export type UseHasPermissionOptions<
  TAuthClient extends OrganizationAuthClient
> = HasPermissionOptions<TAuthClient> & HasPermissionParams<TAuthClient>

export function useHasPermission<TAuthClient extends OrganizationAuthClient>(
  authClient: TAuthClient,
  options: UseHasPermissionOptions<TAuthClient> = {} as UseHasPermissionOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { fetchOptions, permissions, organizationId, ...queryOptionsRest } =
    options

  const baseOptions = hasPermissionOptions(authClient, userId, {
    fetchOptions,
    organizationId,
    permissions
  } as HasPermissionParams<TAuthClient>)

  return useQuery(
    {
      ...queryOptionsRest,
      ...baseOptions
    },
    queryClient
  )
}
