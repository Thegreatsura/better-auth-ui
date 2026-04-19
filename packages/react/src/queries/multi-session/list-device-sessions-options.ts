import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's device sessions
 * (multi-session account switcher).
 *
 * Keyed per-user (enables offline account switching with a persister).
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.multiSession.listDeviceSessions`.
 */
export function listDeviceSessionsOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId?: string,
  params?: Parameters<TAuthClient["multiSession"]["listDeviceSessions"]>[0]
) {
  return authQueryOptions<TAuthClient["multiSession"]["listDeviceSessions"]>()(
    authClient.multiSession.listDeviceSessions,
    ["auth", "user", userId, "listDeviceSessions"],
    params
  )
}
