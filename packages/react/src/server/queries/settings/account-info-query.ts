import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { AuthServer } from "../../../lib/auth-server"

type AccountInfoData<TAuth extends AuthServer> = ReturnType<
  TAuth["api"]["accountInfo"]
>

type AccountInfoParams<TAuth extends AuthServer> = Parameters<
  TAuth["api"]["accountInfo"]
>[0]

/**
 * Query options factory for provider-specific account info.
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `accountInfoOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.accountInfo`.
 */
export function accountInfoOptions<TAuth extends AuthServer>(
  auth: TAuth,
  userId: string,
  params: AccountInfoParams<TAuth>
) {
  type TData = AccountInfoData<TAuth>
  const queryKey = authKeys.accountInfo(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.accountInfo(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureAccountInfo = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: AccountInfoParams<TAuth>
) => queryClient.ensureQueryData(accountInfoOptions(auth, userId, params))

export const prefetchAccountInfo = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: AccountInfoParams<TAuth>
) => queryClient.prefetchQuery(accountInfoOptions(auth, userId, params))

export const fetchAccountInfo = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: AccountInfoParams<TAuth>
) => queryClient.fetchQuery(accountInfoOptions(auth, userId, params))
