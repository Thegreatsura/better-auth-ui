import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for changing the authenticated user's password.
 *
 * @param authClient - The Better Auth client.
 */
export function changePasswordOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.changePassword, [
    "auth",
    "changePassword"
  ])
}
