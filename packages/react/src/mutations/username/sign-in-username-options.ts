import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for username/password sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInUsernameOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signIn.username, [
    "auth",
    "signIn",
    "username"
  ])
}
