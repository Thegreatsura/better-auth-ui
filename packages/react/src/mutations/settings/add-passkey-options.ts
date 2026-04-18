import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for registering a new passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function addPasskeyOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.passkey.addPasskey, [
    "auth",
    "passkey",
    "addPasskey"
  ])
}
