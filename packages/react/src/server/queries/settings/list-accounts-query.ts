import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { AuthServer } from "../../../lib/auth-server"

type ListAccountsData<TAuth extends AuthServer> = ReturnType<
  TAuth["api"]["listUserAccounts"]
>

type ListAccountsParams<TAuth extends AuthServer> = Parameters<
  TAuth["api"]["listUserAccounts"]
>[0]

/**
 * Query options factory for the current user's linked social accounts.
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listAccountsOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listUserAccounts`.
 */
export function listAccountsOptions<TAuth extends AuthServer>(
  auth: TAuth,
  userId: string,
  params: ListAccountsParams<TAuth>
) {
  type TData = ListAccountsData<TAuth>
  const queryKey = authKeys.listAccounts(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listUserAccounts(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListAccounts = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListAccountsParams<TAuth>
) => queryClient.ensureQueryData(listAccountsOptions(auth, userId, params))

export const prefetchListAccounts = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListAccountsParams<TAuth>
) => queryClient.prefetchQuery(listAccountsOptions(auth, userId, params))

export const fetchListAccounts = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  userId: string,
  params: ListAccountsParams<TAuth>
) => queryClient.fetchQuery(listAccountsOptions(auth, userId, params))
