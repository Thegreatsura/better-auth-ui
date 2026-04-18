import { type UseSessionOptions, useSession } from "./use-session"

/**
 * Retrieve the current authenticated user.
 *
 * Thin wrapper over `useSession` that returns `session.user` as `data`.
 *
 * @param options - Better Auth params (`query`, `fetchOptions`) and React
 *   Query options forwarded to `useQuery`.
 * @returns React Query result with `data` narrowed to the user object.
 */
export function useUser(options?: UseSessionOptions) {
  const { data, ...rest } = useSession(options)

  return {
    data: data?.user,
    ...rest
  }
}
