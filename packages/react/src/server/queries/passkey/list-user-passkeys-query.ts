import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { PasskeyAuthServer } from "../../../lib/auth-server"

type ListUserPasskeysData<TAuth extends PasskeyAuthServer> = ReturnType<
  TAuth["api"]["listPasskeys"]
>

type ListUserPasskeysParams<TAuth extends PasskeyAuthServer> = Parameters<
  TAuth["api"]["listPasskeys"]
>[0]

/**
 * Query options factory for the current user's passkeys.
 *
 * @param auth - The Better Auth server instance with the passkey plugin.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listUserPasskeysOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listPasskeys`.
 */
export function listUserPasskeysOptions<TAuth extends PasskeyAuthServer>(
  auth: TAuth,
  userId: string,
  params: ListUserPasskeysParams<TAuth>
) {
  type TData = ListUserPasskeysData<TAuth>
  const queryKey = authKeys.listUserPasskeys(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listPasskeys(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListUserPasskeys = <TAuth extends PasskeyAuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListUserPasskeysParams<TAuth>
) => queryClient.ensureQueryData(listUserPasskeysOptions(auth, userId, params))

export const prefetchListUserPasskeys = <TAuth extends PasskeyAuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListUserPasskeysParams<TAuth>
) => queryClient.prefetchQuery(listUserPasskeysOptions(auth, userId, params))

export const fetchListUserPasskeys = <TAuth extends PasskeyAuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListUserPasskeysParams<TAuth>
) => queryClient.fetchQuery(listUserPasskeysOptions(auth, userId, params))
