import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for passkey sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInPasskeyOptions(authClient: PasskeyAuthClient) {
  return authMutationOptions(authClient.signIn.passkey, [
    "auth",
    "signIn",
    "passkey"
  ])
}
