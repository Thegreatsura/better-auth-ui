import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { AuthServer } from "../../../lib/auth-server"

type ListSessionsData<TAuth extends AuthServer> = ReturnType<
  TAuth["api"]["listSessions"]
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
  const queryKey = authKeys.listSessions(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listSessions(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListSessions = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.ensureQueryData(listSessionsOptions(auth, userId, params))

export const prefetchListSessions = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.prefetchQuery(listSessionsOptions(auth, userId, params))

export const fetchListSessions = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListSessionsParams<TAuth>
) => queryClient.fetchQuery(listSessionsOptions(auth, userId, params))
