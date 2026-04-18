import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for sending a verification email.
 *
 * @param authClient - The Better Auth client.
 */
export function sendVerificationEmailOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.sendVerificationEmail, [
    "auth",
    "sendVerificationEmail"
  ])
}
