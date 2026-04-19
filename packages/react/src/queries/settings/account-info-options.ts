import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for provider-specific account info.
 *
 * Keyed per-user. `userId` and `params` are both optional so the factory can
 * build stable options before either is known — the consumer swaps `queryFn`
 * for `skipToken` until ready.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.accountInfo`.
 */
export function accountInfoOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId?: string,
  params?: Parameters<TAuthClient["accountInfo"]>[0]
) {
  return authQueryOptions<TAuthClient["accountInfo"]>()(
    authClient.accountInfo,
    ["auth", "user", userId, "accountInfo"],
    params
  )
}
