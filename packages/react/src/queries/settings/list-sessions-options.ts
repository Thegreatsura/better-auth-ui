import { skipToken } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's active sessions. Skips when
 * `userId` is `undefined`.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.listSessions`.
 */
export function listSessionsOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: Parameters<TAuthClient["listSessions"]>[0]
) {
  return authQueryOptions(
    userId
      ? (authClient.listSessions as TAuthClient["listSessions"])
      : skipToken,
    ["auth", "user", userId, "listSessions"],
    params
  )
}
