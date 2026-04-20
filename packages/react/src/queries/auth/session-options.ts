import {
  type DataTag,
  queryOptions,
  type UseQueryOptions
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-clients/auth-client"

export type SessionData<TAuthClient extends AuthClient> = InferData<
  TAuthClient,
  "getSession"
>

export type SessionParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["getSession"]
>[0]

export type SessionOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof sessionOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

/**
 * Query options factory for the current session.
 *
 * @param authClient - The Better Auth client.
 * @param params - Parameters forwarded to `authClient.getSession`.
 */
export function sessionOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  params?: SessionParams<TAuthClient>
) {
  type TData = SessionData<TAuthClient>
  const queryKey = ["auth", "getSession", params?.query ?? null] as const

  return queryOptions({
    queryKey,
    queryFn: ({ signal }) =>
      authClient.getSession({
        ...params,
        fetchOptions: { ...params?.fetchOptions, signal, throw: true }
      })
  }) as UseQueryOptions<
    TData,
    BetterFetchError,
    TData,
    DataTag<typeof queryKey, TData, BetterFetchError>
  >
}
