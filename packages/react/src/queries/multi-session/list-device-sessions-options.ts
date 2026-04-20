import { type DataTag, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData } from "../../lib/auth-clients/auth-client"
import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"

export type ListDeviceSessionsData<TAuthClient extends MultiSessionAuthClient> =
  InferData<TAuthClient["multiSession"]["listDeviceSessions"]>

export type ListDeviceSessionsParams<
  TAuthClient extends MultiSessionAuthClient
> = Parameters<TAuthClient["multiSession"]["listDeviceSessions"]>[0]

export type ListDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
> = Omit<
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
  const queryKey = [
    "auth",
    "user",
    userId,
    "listDeviceSessions",
    params?.query ?? null
  ] as const

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
