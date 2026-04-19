import { skipToken } from "@tanstack/react-query"
import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { authQueryOptions } from "../auth-query-options"

/**
 * Query options factory for the current user's passkeys. Skips when `userId`
 * is `undefined`.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param userId - The current signed in user's ID.
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 */
export function listUserPasskeysOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: Parameters<TAuthClient["passkey"]["listUserPasskeys"]>[0]
) {
  return authQueryOptions<TAuthClient["passkey"]["listUserPasskeys"]>()(
    userId ? authClient.passkey.listUserPasskeys : skipToken,
    ["auth", "user", userId, "listUserPasskeys"],
    params
  )
}
