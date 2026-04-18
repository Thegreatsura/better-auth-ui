import type { AuthClient } from "../lib/auth-client"
import { authQueryOptions } from "./auth-query-options"

/**
 * Query options factory for the current session.
 *
 * Access `.queryKey` on the returned options for cache seeding or
 * invalidation: `queryClient.setQueryData(sessionOptions(authClient).queryKey, session)`.
 *
 * @param authClient - The Better Auth client.
 * @param params - Parameters forwarded to `authClient.getSession`.
 */
export function sessionOptions(
  authClient: AuthClient,
  params?: Parameters<AuthClient["getSession"]>[0]
) {
  return authQueryOptions(authClient.getSession, ["auth", "getSession"], params)
}
