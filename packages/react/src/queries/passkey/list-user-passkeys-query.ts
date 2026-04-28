import { authQueryKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions,
  skipToken,
  useQuery
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, PasskeyAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

type ListUserPasskeysData<TAuthClient extends PasskeyAuthClient> = InferData<
  TAuthClient["passkey"]["listUserPasskeys"]
>

export type ListUserPasskeysParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["passkey"]["listUserPasskeys"]>[0]

type ListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof listUserPasskeysOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

/**
 * Query options factory for the current user's passkeys.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param userId - The current signed-in user's ID. Used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export function listUserPasskeysOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListUserPasskeysParams<TAuthClient>
) {
  type TData = ListUserPasskeysData<TAuthClient>
  const queryKey = authQueryKeys.listUserPasskeys(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.passkey.listUserPasskeys({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

/**
 * Get the current user's passkeys from the query cache, calling
 * `fetchListUserPasskeys` under the hood if no cached entry exists. Resolves
 * with the passkey list, making it ideal for loaders or `beforeLoad` guards.
 *
 * @param queryClient - The React Query client.
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export const ensureListUserPasskeys = <TAuthClient extends PasskeyAuthClient>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string,
  params?: ListUserPasskeysParams<TAuthClient>
) =>
  queryClient.ensureQueryData(
    listUserPasskeysOptions(authClient, userId, params)
  )

/**
 * Prefetch the current user's passkeys into the query cache. Behaves like
 * `fetchListUserPasskeys`, but does not throw on error and does not return
 * the data — use this to warm the cache without blocking navigation.
 *
 * @param queryClient - The React Query client.
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export const prefetchListUserPasskeys = <TAuthClient extends PasskeyAuthClient>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string,
  params?: ListUserPasskeysParams<TAuthClient>
) =>
  queryClient.prefetchQuery(listUserPasskeysOptions(authClient, userId, params))

/**
 * Fetch and cache the current user's passkeys, resolving with the data or
 * throwing on error. If a cached entry exists and is neither invalidated
 * nor older than `staleTime`, the cached value is returned without a
 * network call; otherwise the latest data is fetched.
 *
 * @param queryClient - The React Query client.
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export const fetchListUserPasskeys = <TAuthClient extends PasskeyAuthClient>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string,
  params?: ListUserPasskeysParams<TAuthClient>
) => queryClient.fetchQuery(listUserPasskeysOptions(authClient, userId, params))

export type UseListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> =
  ListUserPasskeysOptions<TAuthClient> & ListUserPasskeysParams<TAuthClient>

/**
 * Subscribe to the current user's passkeys via TanStack Query.
 *
 * Shares a query key with the server-side `listUserPasskeysOptions`, so
 * SSR-hydrated data is reused from the cache without an immediate refetch.
 * The query is gated on a signed-in user; while the session is loading or
 * absent, the underlying `queryFn` is replaced with `skipToken`.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - `listUserPasskeys` params (`query`, `fetchOptions`) merged
 *   with `useQuery` options (e.g. `enabled`, `staleTime`, `select`).
 * @param queryClient - Optional custom `QueryClient`. Defaults to the client
 *   from the nearest `QueryClientProvider`.
 */
export function useListUserPasskeys<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options: UseListUserPasskeysOptions<TAuthClient> = {},
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listUserPasskeysOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery(
    {
      ...queryOptions,
      ...baseOptions,
      queryFn: userId ? baseOptions.queryFn : skipToken
    },
    queryClient
  )
}
