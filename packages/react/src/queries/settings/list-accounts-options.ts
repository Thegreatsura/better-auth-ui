import { skipToken } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for a user's linked social accounts. Skips when
 * `userId` is `undefined`.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.listAccounts`.
 */
export function listAccountsOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: Parameters<TAuthClient["listAccounts"]>[0]
) {
  return authQueryOptions(
    userId
      ? (authClient.listAccounts as TAuthClient["listAccounts"])
      : skipToken,
    ["auth", "user", userId, "listAccounts"],
    params
  )
}
