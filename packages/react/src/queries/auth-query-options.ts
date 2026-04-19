import {
  type DataTag,
  type QueryKey,
  queryOptions,
  skipToken,
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
 * Pass `skipToken` for `authFn` to mark the query as skipped (e.g. waiting on
 * a prerequisite like an active session). Every consumer — `useQuery`,
 * `prefetchQuery`, `ensureQueryData`, etc. — will honor the skip.
 *
 * Curried to sidestep TypeScript's all-or-nothing type-argument rule: pin
 * the auth fn type on the first call (needed to prevent widening of
 * generic-indexed argument types like `TAuthClient["getSession"]`), and let
 * the prefix tuple infer from the second call's argument.
 *
 * @example
 * authQueryOptions<TAuthClient["getSession"]>()(
 *   authClient.getSession,
 *   ["auth", "getSession"],
 *   params
 * )
 *
 * @example Skip until a prerequisite resolves:
 * authQueryOptions<TAuthClient["listAccounts"]>()(
 *   userId ? authClient.listAccounts : skipToken,
 *   ["auth", "user", userId, "listAccounts"],
 *   params
 * )
 */
export function authQueryOptions<TFn extends AuthFn>() {
  return <const TPrefix extends QueryKey>(
    authFn: TFn | typeof skipToken,
    queryKey: TPrefix,
    params?: Parameters<TFn>[0]
  ): AuthQueryOptions<TFn, TPrefix> =>
    queryOptions<AuthFnData<TFn>, BetterFetchError>({
      queryKey: [...queryKey, params?.query ?? null] as const,
      queryFn:
        authFn === skipToken
          ? skipToken
          : ({ signal }) =>
              authFn({
                ...params,
                fetchOptions: { ...params?.fetchOptions, signal, throw: true }
              }) as Promise<AuthFnData<TFn>>
    }) as AuthQueryOptions<TFn, TPrefix>
}
