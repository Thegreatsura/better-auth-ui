import type { AuthClient } from "../../lib/auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's passkeys.
 *
 * Keyed per-user (enables offline account switching with a persister).
 *
 * @param authClient - The Better Auth client.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export function listUserPasskeysOptions(
  authClient: AuthClient,
  userId?: string,
  params?: Parameters<AuthClient["passkey"]["listUserPasskeys"]>[0]
) {
  return authQueryOptions(
    authClient.passkey.listUserPasskeys,
    ["auth", "user", userId, "listUserPasskeys"],
    params
  )
}
