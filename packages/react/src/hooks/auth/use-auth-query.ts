import { type QueryKey, useQuery } from "@tanstack/react-query"
import { type AuthFn, authQueryOptions } from "../../queries/auth-query-options"

/**
 * Escape-hatch hook for Better Auth endpoints that don't have a purpose-built
 * hook in this library yet. Thin wrapper over `useQuery` and `authQueryOptions`.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.magicLink.list`).
 * @param queryKey - Scope prefix for the key. `params.query` is appended automatically.
 * @param params - Parameters forwarded to `authFn`.
 * @param options - React Query options forwarded to `useQuery`.
 */
export function useAuthQuery<
  TFn extends AuthFn,
  const TQueryKey extends QueryKey
>(
  authFn: TFn,
  queryKey: TQueryKey,
  params?: Parameters<TFn>[0],
  options?: Omit<
    ReturnType<typeof authQueryOptions<TFn, TQueryKey>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    ...authQueryOptions(authFn, queryKey, params),
    ...options
  })
}
