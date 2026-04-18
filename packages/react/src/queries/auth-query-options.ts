import { type QueryKey, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

export type AuthFn<TData = unknown> = (params: {
  query?: Record<string, unknown>
  fetchOptions?: BetterFetchOption
}) => Promise<{ data: TData }>

type AuthFnData<TFn> = TFn extends AuthFn<infer TData> ? TData : never

/**
 * Build `queryOptions` for a Better Auth endpoint.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.getSession`).
 * @param queryKey - Scope prefix for the key. `params.query` is appended automatically.
 * @param params - Parameters forwarded to `authFn`.
 */
export function authQueryOptions<
  TFn extends AuthFn,
  const TQueryKey extends QueryKey
>(authFn: TFn, queryKey: TQueryKey, params?: Parameters<TFn>[0]) {
  return queryOptions<AuthFnData<TFn>, BetterFetchError>({
    queryKey: [...queryKey, params?.query ?? null] as const,
    queryFn: ({ signal }) =>
      authFn({
        ...params,
        fetchOptions: { ...params?.fetchOptions, signal, throw: true }
      }) as Promise<AuthFnData<TFn>>
  })
}
