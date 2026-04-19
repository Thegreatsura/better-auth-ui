import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for deleting a passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function deletePasskeyOptions(authClient: PasskeyAuthClient) {
  return authMutationOptions(authClient.passkey.deletePasskey, [
    "auth",
    "passkey",
    "deletePasskey"
  ])
}
