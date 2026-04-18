import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for passkey sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInPasskeyOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signIn.passkey, [
    "auth",
    "signIn",
    "passkey"
  ])
}
