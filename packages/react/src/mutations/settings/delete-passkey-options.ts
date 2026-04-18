import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for deleting a passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function deletePasskeyOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.passkey.deletePasskey, [
    "auth",
    "passkey",
    "deletePasskey"
  ])
}
