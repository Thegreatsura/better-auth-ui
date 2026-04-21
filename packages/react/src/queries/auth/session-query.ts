import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions,
  useQuery
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-client"

export type SessionData<TAuthClient extends AuthClient> = InferData<
  TAuthClient["getSession"]
>

type SessionParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["getSession"]
>[0]

type SessionOptions<TAuthClient extends AuthClient> = Omit<
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

export const ensureSession = <TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  queryClient: QueryClient,
  params?: SessionParams<TAuthClient>
) => queryClient.ensureQueryData(sessionOptions(authClient, params))

export const prefetchSession = <TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  queryClient: QueryClient,
  params?: SessionParams<TAuthClient>
) => queryClient.prefetchQuery(sessionOptions(authClient, params))

export const fetchSession = <TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  queryClient: QueryClient,
  params?: SessionParams<TAuthClient>
) => queryClient.fetchQuery(sessionOptions(authClient, params))

export type UseSessionOptions<TAuthClient extends AuthClient> =
  SessionOptions<TAuthClient> & SessionParams<TAuthClient>

/**
 * Retrieve the current session.
 *
 * @param authClient - The Better Auth client.
 * @param options - `getSession` params & `useQuery` options.
 */
export function useSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseSessionOptions<TAuthClient> = {}
) {
  const { query, fetchOptions, ...queryOptions } = options

  return useQuery({
    ...sessionOptions(authClient, { query, fetchOptions }),
    ...queryOptions
  })
}
