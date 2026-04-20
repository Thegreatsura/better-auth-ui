import {
  type DataTag,
  type QueryKey,
  queryOptions,
  type UseQueryOptions
} from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

export type AuthFn<TData = unknown> = (params: {
  query?: Record<string, unknown>
  fetchOptions?: BetterFetchOption
}) => Promise<{ data: TData }>

export type AuthFnData<TFn> = TFn extends AuthFn<infer TData> ? TData : never

/**
 * Final query key produced by {@link authQueryOptions}: the caller's prefix
 * followed by `params.query ?? null`.
 */
export type AuthQueryKey<
  TFn extends AuthFn = AuthFn,
  TPrefix extends QueryKey = QueryKey
> = readonly [...TPrefix, NonNullable<Parameters<TFn>[0]>["query"] | null]

/**
 * Return type of {@link authQueryOptions}. Named so TypeScript emits
 * `DataTag<…>` by reference in the `.d.ts`, instead of the raw
 * `{ [dataTagSymbol]: … }` intersection — which triggers a declaration-emit
 * bug where `dataTagSymbol` isn't re-imported at the use site and silently
 * breaks `setQueryData`/`getQueryData` type inference at the consumer.
 */
export type AuthQueryOptions<
  TFn extends AuthFn = AuthFn,
  TPrefix extends QueryKey = QueryKey
> = Omit<
  UseQueryOptions<
    AuthFnData<TFn>,
    BetterFetchError,
    AuthFnData<TFn>,
    AuthQueryKey<TFn, TPrefix>
  >,
  "queryKey"
> & {
  queryKey: DataTag<
    AuthQueryKey<TFn, TPrefix>,
    AuthFnData<TFn>,
    BetterFetchError
  >
}

/**
 * Build `queryOptions` for a Better Auth endpoint.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.getSession`).
 * @param queryKey - Scope prefix for the key. `params.query` is appended automatically.
 * @param params - Parameters forwarded to `authFn`.
 */
export function authQueryOptions<
  TFn extends AuthFn,
  const TPrefix extends QueryKey
>(
  authFn: TFn,
  queryKey: TPrefix,
  params?: Parameters<TFn>[0]
): AuthQueryOptions<TFn, TPrefix> {
  return queryOptions<AuthFnData<TFn>, BetterFetchError>({
    queryKey: [...queryKey, params?.query ?? null] as const,
    queryFn: ({ signal }) =>
      authFn({
        ...params,
        fetchOptions: { ...params?.fetchOptions, signal, throw: true }
      }) as Promise<AuthFnData<TFn>>
  }) as AuthQueryOptions<TFn, TPrefix>
}
