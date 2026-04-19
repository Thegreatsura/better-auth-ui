import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for registering a new passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function addPasskeyOptions(authClient: PasskeyAuthClient) {
  return authMutationOptions(authClient.passkey.addPasskey, [
    "auth",
    "passkey",
    "addPasskey"
  ])
}
