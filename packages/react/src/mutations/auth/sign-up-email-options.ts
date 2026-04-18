import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for email/password sign-up.
 *
 * @param authClient - The Better Auth client.
 */
export function signUpEmailOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signUp.email, [
    "auth",
    "signUp",
    "email"
  ])
}
