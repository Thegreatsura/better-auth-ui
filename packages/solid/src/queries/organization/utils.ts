import {
  type DataTag,
  type QueryClient,
  type QueryKey,
  queryOptions,
  skipToken
} from "@tanstack/solid-query"
import type { BetterFetchError } from "better-auth/client"

export type OrganizationQueryMethod<TData = unknown> = (
  // biome-ignore lint/suspicious/noExplicitAny: Better Auth generated methods use plugin-specific params.
  params?: any
) => Promise<TData>

export type OrganizationQueryParams<TMethod extends OrganizationQueryMethod> =
  Parameters<TMethod>[0]
export type OrganizationQueryData<TMethod extends OrganizationQueryMethod> =
  Awaited<ReturnType<TMethod>>

export function createOrganizationQueryOptions<
  TMethod extends OrganizationQueryMethod,
  const TQueryKey extends QueryKey
>(
  queryKey: TQueryKey,
  authFn: TMethod,
  params?: OrganizationQueryParams<TMethod>
) {
  type TData = OrganizationQueryData<TMethod>

  const options = queryOptions<TData, BetterFetchError, TData, TQueryKey>({
    queryKey,
    queryFn: ({ signal }) =>
      authFn({
        ...(params ?? {}),
        fetchOptions: {
          ...(params as { fetchOptions?: Record<string, unknown> } | undefined)
            ?.fetchOptions,
          signal,
          throw: true
        }
      } as OrganizationQueryParams<TMethod>) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<TQueryKey, TData, BetterFetchError>
  }
}

export const ensureOrganizationQuery = <
  TMethod extends OrganizationQueryMethod,
  const TQueryKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey: TQueryKey,
  authFn: TMethod,
  params?: OrganizationQueryParams<TMethod>
) =>
  queryClient.ensureQueryData(
    createOrganizationQueryOptions(queryKey, authFn, params) as never
  )

export const prefetchOrganizationQuery = <
  TMethod extends OrganizationQueryMethod,
  const TQueryKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey: TQueryKey,
  authFn: TMethod,
  params?: OrganizationQueryParams<TMethod>
) =>
  queryClient.prefetchQuery(
    createOrganizationQueryOptions(queryKey, authFn, params) as never
  )

export const fetchOrganizationQuery = <
  TMethod extends OrganizationQueryMethod,
  const TQueryKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey: TQueryKey,
  authFn: TMethod,
  params?: OrganizationQueryParams<TMethod>
) =>
  queryClient.fetchQuery(
    createOrganizationQueryOptions(queryKey, authFn, params) as never
  )

export { skipToken }
