import type { AuthClient } from "../../lib/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current session.
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
