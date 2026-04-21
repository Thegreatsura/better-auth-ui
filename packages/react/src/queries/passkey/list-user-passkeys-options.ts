import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData } from "../../lib/auth-client"
import type { PasskeyAuthClient } from "../../lib/auth-client"

export type ListUserPasskeysData<TAuthClient extends PasskeyAuthClient> =
  InferData<TAuthClient["passkey"]["listUserPasskeys"]>

export type ListUserPasskeysParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["passkey"]["listUserPasskeys"]>[0]

export type ListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> =
  Omit<
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
