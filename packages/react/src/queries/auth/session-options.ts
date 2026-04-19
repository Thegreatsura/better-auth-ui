import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current session.
 *
 * @param authClient - The Better Auth client.
 * @param params - Parameters forwarded to `authClient.getSession`.
 */
export function sessionOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  params?: Parameters<TAuthClient["getSession"]>[0]
) {
  return authQueryOptions<TAuthClient["getSession"]>()(
    authClient.getSession,
    ["auth", "getSession"],
    params
  )
}
