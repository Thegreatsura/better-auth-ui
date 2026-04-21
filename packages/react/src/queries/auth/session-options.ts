import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-client"

export type SessionData<TAuthClient extends AuthClient> = InferData<
  TAuthClient["getSession"]
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
  const queryKey = authKeys.session(params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.getSession({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}
