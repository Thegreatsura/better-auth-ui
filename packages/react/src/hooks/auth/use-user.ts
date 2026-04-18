import type { AuthClient } from "../../lib/auth-client"
import { type UseSessionOptions, useSession } from "./use-session"

/**
 * Retrieve the current authenticated user.
 *
 * Thin wrapper over `useSession` that returns `session.user` as `data`.
 *
 * @param params - Parameters forwarded to `authClient.getSession`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result with `data` narrowed to the user object.
 */
export function useUser(
  params?: Parameters<AuthClient["getSession"]>[0],
  options?: UseSessionOptions
) {
  const { data, ...rest } = useSession(params, options)

  return {
    data: data?.user,
    ...rest
  }
}
