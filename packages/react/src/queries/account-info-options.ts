import type { AuthClient } from "../lib/auth-client"
import { authQueryOptions } from "./auth-query-options"

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
export function accountInfoOptions(
  authClient: AuthClient,
  userId?: string,
  params?: Parameters<AuthClient["accountInfo"]>[0]
) {
  return authQueryOptions(
    authClient.accountInfo,
    ["auth", "user", userId, "accountInfo"],
    params
  )
}
