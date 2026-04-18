import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for deleting the authenticated user's account.
 *
 * @param authClient - The Better Auth client.
 */
export function deleteUserOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.deleteUser, ["auth", "deleteUser"])
}
