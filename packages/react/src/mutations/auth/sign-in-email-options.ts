import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for email/password sign-in.
 *
 * The returned `mutationKey` (`["auth", "signIn", "email"]`) is stable and
 * can be passed to `useIsMutating` or matched inside a global
 * `MutationCache` observer for toast handling.
 *
 * @param authClient - The Better Auth client.
 */
export function signInEmailOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signIn.email, [
    "auth",
    "signIn",
    "email"
  ])
}
