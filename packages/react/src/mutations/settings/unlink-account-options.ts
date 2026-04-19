import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for unlinking a social provider from the current user.
 *
 * @param authClient - The Better Auth client.
 */
export function unlinkAccountOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.unlinkAccount, [
    "auth",
    "unlinkAccount"
  ])
}
