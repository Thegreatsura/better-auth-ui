import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { MultiSessionAuthServer } from "../../../lib/auth-server"

type ListDeviceSessionsData<TAuth extends MultiSessionAuthServer> = ReturnType<
  TAuth["api"]["listDeviceSessions"]
>

type ListDeviceSessionsParams<TAuth extends MultiSessionAuthServer> =
  Parameters<TAuth["api"]["listDeviceSessions"]>[0]

/**
 * Query options factory for the current user's device sessions.
 *
 * @param auth - The Better Auth server instance with the multi-session plugin.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listDeviceSessionsOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listDeviceSessions`.
 */
export function listDeviceSessionsOptions<TAuth extends MultiSessionAuthServer>(
  auth: TAuth,
  userId: string,
  params: ListDeviceSessionsParams<TAuth>
) {
  type TData = ListDeviceSessionsData<TAuth>
  const queryKey = authKeys.listDeviceSessions(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listDeviceSessions(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListDeviceSessions = <TAuth extends MultiSessionAuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListDeviceSessionsParams<TAuth>
) =>
  queryClient.ensureQueryData(listDeviceSessionsOptions(auth, userId, params))

export const prefetchListDeviceSessions = <
  TAuth extends MultiSessionAuthServer
>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListDeviceSessionsParams<TAuth>
) => queryClient.prefetchQuery(listDeviceSessionsOptions(auth, userId, params))

export const fetchListDeviceSessions = <TAuth extends MultiSessionAuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListDeviceSessionsParams<TAuth>
) => queryClient.fetchQuery(listDeviceSessionsOptions(auth, userId, params))
