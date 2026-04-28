import { authQueryKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { AuthServer } from "../../../lib/auth-server"

type ListSessionsData<TAuth extends AuthServer> = Awaited<
  ReturnType<TAuth["api"]["listSessions"]>
>

type ListSessionsParams<TAuth extends AuthServer> = Parameters<
  TAuth["api"]["listSessions"]
>[0]

/**
 * Query options factory for the current user's active sessions.
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listSessionsOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listSessions`.
 */
export function listSessionsOptions<TAuth extends AuthServer>(
  auth: TAuth,
  userId: string,
  params: ListSessionsParams<TAuth>
) {
  type TData = ListSessionsData<TAuth>
  const queryKey = authQueryKeys.listSessions(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listSessions(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

/**
 * Get the current user's active sessions from the query cache, calling
 * `fetchListSessions` under the hood if no cached entry exists. Resolves
 * with the session list, making it suitable for reading directly in a server
 * component.
 *
 * @param queryClient - The React Query client used for SSR hydration.
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `auth.api.listSessions`.
 */
export const ensureListSessions = <TAuth extends AuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.ensureQueryData(listSessionsOptions(auth, userId, params))

/**
 * Prefetch the current user's active sessions into the query cache. Behaves
 * like `fetchListSessions`, but does not throw on error and does not return
 * the data — use this when you only need the value to be available after
 * hydration.
 *
 * @param queryClient - The React Query client used for SSR hydration.
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `auth.api.listSessions`.
 */
export const prefetchListSessions = <TAuth extends AuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.prefetchQuery(listSessionsOptions(auth, userId, params))

/**
 * Fetch and cache the current user's active sessions, resolving with the
 * data or throwing on error. If a cached entry exists and is neither
 * invalidated nor older than `staleTime`, the cached value is returned
 * without a network call; otherwise the latest data is fetched.
 *
 * @param queryClient - The React Query client used for SSR hydration.
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID, used for cache partitioning.
 * @param params - Parameters forwarded to `auth.api.listSessions`.
 */
export const fetchListSessions = <TAuth extends AuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.fetchQuery(listSessionsOptions(auth, userId, params))
