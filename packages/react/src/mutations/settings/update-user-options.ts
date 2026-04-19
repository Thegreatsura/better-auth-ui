import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for updating the authenticated user's profile.
 *
 * The returned `mutationKey` (`["auth", "updateUser"]`) is stable and can
 * be passed to `useIsMutating` or matched inside a global `MutationCache`
 * observer for toast handling.
 *
 * @param authClient - The Better Auth client.
 */
export function updateUserOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.updateUser, ["auth", "updateUser"])
}
