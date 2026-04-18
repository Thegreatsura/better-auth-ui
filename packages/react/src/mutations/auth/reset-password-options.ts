import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for completing a password reset.
 *
 * @param authClient - The Better Auth client.
 */
export function resetPasswordOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.resetPassword, [
    "auth",
    "resetPassword"
  ])
}
