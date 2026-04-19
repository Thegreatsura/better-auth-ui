import { skipToken } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for provider-specific account info. Skips when
 * `userId` or `params.query.accountId` is missing.
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.accountInfo`.
 */
export function accountInfoOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: Parameters<TAuthClient["accountInfo"]>[0]
) {
  return authQueryOptions<TAuthClient["accountInfo"]>()(
    userId && params?.query?.accountId ? authClient.accountInfo : skipToken,
    ["auth", "user", userId, "accountInfo"],
    params
  )
}
