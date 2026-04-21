import { authKeys } from "@better-auth-ui/core"
import { type DataTag, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient, InferData } from "../../lib/auth-client"

export type ListAccountsData<TAuthClient extends AuthClient> = InferData<
  TAuthClient["listAccounts"]
>

export type ListAccountsParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["listAccounts"]
>[0]

export type ListAccountsOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof listAccountsOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

/**
 * Query options factory for a user's linked social accounts.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed-in user's ID. Used for cache partitioning.
 * @param params - Parameters forwarded to `authClient.listAccounts`.
 */
export function listAccountsOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListAccountsParams<TAuthClient>
) {
  type TData = ListAccountsData<TAuthClient>
  const queryKey = authKeys.listAccounts(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.listAccounts({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}
