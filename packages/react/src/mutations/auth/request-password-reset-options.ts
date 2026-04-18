import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for requesting a password reset email.
 *
 * @param authClient - The Better Auth client.
 */
export function requestPasswordResetOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.requestPasswordReset, [
    "auth",
    "requestPasswordReset"
  ])
}
