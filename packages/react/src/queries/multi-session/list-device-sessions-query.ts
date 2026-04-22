import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, MultiSessionAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

type ListDeviceSessionsData<TAuthClient extends MultiSessionAuthClient> =
  InferData<TAuthClient["multiSession"]["listDeviceSessions"]>

export type ListDeviceSessionsParams<TAuthClient extends MultiSessionAuthClient> =
  Parameters<TAuthClient["multiSession"]["listDeviceSessions"]>[0]

type ListDeviceSessionsOptions<TAuthClient extends MultiSessionAuthClient> =
  Omit<
    ReturnType<typeof listDeviceSessionsOptions<TAuthClient>>,
    "queryKey" | "queryFn"
  >

/**
 * Query options factory for the current user's device sessions.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param userId - The current signed-in user's ID. Used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.multiSession.listDeviceSessions`.
 */
export function listDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListDeviceSessionsParams<TAuthClient>
) {
  type TData = ListDeviceSessionsData<TAuthClient>
  const queryKey = authKeys.listDeviceSessions(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.multiSession.listDeviceSessions({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export type UseListDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
> = ListDeviceSessionsOptions<TAuthClient> &
  ListDeviceSessionsParams<TAuthClient>

/**
 * Retrieve the device sessions (multi-session account switcher).
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param options - `listDeviceSessions` params & `useQuery` options.
 */
export function useListDeviceSessions<
  TAuthClient extends MultiSessionAuthClient
>(
  authClient: TAuthClient,
  options: UseListDeviceSessionsOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listDeviceSessionsOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
