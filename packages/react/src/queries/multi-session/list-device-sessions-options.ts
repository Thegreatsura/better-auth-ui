import { skipToken } from "@tanstack/react-query"
import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's device sessions. Skips when
 * `userId` is `undefined`.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.multiSession.listDeviceSessions`.
 */
export function listDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: Parameters<TAuthClient["multiSession"]["listDeviceSessions"]>[0]
) {
  return authQueryOptions<TAuthClient["multiSession"]["listDeviceSessions"]>()(
    userId ? authClient.multiSession.listDeviceSessions : skipToken,
    ["auth", "user", userId, "listDeviceSessions"],
    params
  )
}
