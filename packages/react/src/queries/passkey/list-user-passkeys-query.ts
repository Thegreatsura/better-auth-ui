import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, PasskeyAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

type ListUserPasskeysData<TAuthClient extends PasskeyAuthClient> = InferData<
  TAuthClient["passkey"]["listUserPasskeys"]
>

export type ListUserPasskeysParams<TAuthClient extends PasskeyAuthClient> = Parameters<
  TAuthClient["passkey"]["listUserPasskeys"]
>[0]

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
  const queryKey = authKeys.listUserPasskeys(userId, params?.query)

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

export type UseListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> =
  ListUserPasskeysOptions<TAuthClient> & ListUserPasskeysParams<TAuthClient>

/**
 * Retrieve the passkeys registered for the current user.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - `listUserPasskeys` params & `useQuery` options.
 */
export function useListUserPasskeys<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options: UseListUserPasskeysOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listUserPasskeysOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
