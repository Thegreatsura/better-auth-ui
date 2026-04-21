import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

type AccountInfoData<TAuthClient extends AuthClient> = InferData<
  TAuthClient["accountInfo"]
>

type AccountInfoParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["accountInfo"]
>[0]

type AccountInfoOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof accountInfoOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

/**
 * Query options factory for provider-specific account info.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed-in user's ID. Used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.accountInfo`.
 */
export function accountInfoOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: AccountInfoParams<TAuthClient>
) {
  type TData = AccountInfoData<TAuthClient>
  const queryKey = authKeys.accountInfo(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.accountInfo({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export type UseAccountInfoOptions<TAuthClient extends AuthClient> =
  AccountInfoOptions<TAuthClient> & AccountInfoParams<TAuthClient>

/**
 * Retrieve provider-specific info for a linked account.
 *
 * @param authClient - The Better Auth client.
 * @param options - `accountInfo` params & `useQuery` options.
 */
export function useAccountInfo<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseAccountInfoOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = accountInfoOptions(authClient, userId, {
    query,
    fetchOptions
  })

  const canFetch = Boolean(userId && query?.accountId)

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: canFetch ? baseOptions.queryFn : skipToken
  })
}
