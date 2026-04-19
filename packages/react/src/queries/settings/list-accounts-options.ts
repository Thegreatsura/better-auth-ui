import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for a user's linked social accounts.
 *
 * Keyed per-user (enables offline account switching with a persister).
 * `userId` is optional so the factory can build stable options before the
 * active session resolves — the consumer swaps `queryFn` for `skipToken`
 * until ready.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.listAccounts`.
 */
export function listAccountsOptions(
  authClient: AuthClient,
  userId?: string,
  params?: Parameters<AuthClient["listAccounts"]>[0]
) {
  return authQueryOptions(
    authClient.listAccounts,
    ["auth", "user", userId, "listAccounts"],
    params
  )
}
