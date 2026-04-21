import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

type ListSessionsData<TAuthClient extends AuthClient> = InferData<
  TAuthClient["listSessions"]
>

type ListSessionsParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["listSessions"]
>[0]

type ListSessionsOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof listSessionsOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

/**
 * Query options factory for the current user's active sessions.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed-in user's ID. Used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.listSessions`.
 */
export function listSessionsOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListSessionsParams<TAuthClient>
) {
  type TData = ListSessionsData<TAuthClient>
  const queryKey = authKeys.listSessions(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.listSessions({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export type UseListSessionsOptions<TAuthClient extends AuthClient> =
  ListSessionsOptions<TAuthClient> & ListSessionsParams<TAuthClient>

/**
 * Retrieve the active sessions (devices where the current user is signed in).
 *
 * @param authClient - The Better Auth client.
 * @param options - `listSessions` params & `useQuery` options.
 */
export function useListSessions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseListSessionsOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listSessionsOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
