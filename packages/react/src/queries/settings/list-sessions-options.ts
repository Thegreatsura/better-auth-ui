import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's active sessions.
 *
 * Keyed per-user (enables offline account switching with a persister).
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.listSessions`.
 */
export function listSessionsOptions(
  authClient: AuthClient,
  userId?: string,
  params?: Parameters<AuthClient["listSessions"]>[0]
) {
  return authQueryOptions(
    authClient.listSessions,
    ["auth", "user", userId, "listSessions"],
    params
  )
}
