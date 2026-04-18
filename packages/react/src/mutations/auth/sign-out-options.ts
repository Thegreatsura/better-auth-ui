import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for signing out.
 *
 * @param authClient - The Better Auth client.
 */
export function signOutOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signOut, ["auth", "signOut"])
}
