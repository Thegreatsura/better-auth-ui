import { type QueryKey, queryOptions } from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

type AuthFn<TData = unknown> = (params: {
  query?: Record<string, unknown>
  fetchOptions?: BetterFetchOption
}) => Promise<{ data: TData }>

type AuthFnData<TFn> = TFn extends AuthFn<infer TData> ? TData : never

export function authQuery<TFn extends AuthFn, const TQueryKey extends QueryKey>(
  authFn: TFn,
  queryKey: TQueryKey,
  params?: Parameters<TFn>[0]
) {
  return queryOptions<AuthFnData<TFn>, BetterFetchError>({
    queryKey: [...queryKey, params?.query ?? null] as const,
    queryFn: ({ signal }) =>
      authFn({
        ...params,
        fetchOptions: { ...params?.fetchOptions, signal, throw: true }
      }) as Promise<AuthFnData<TFn>>
  })
}
