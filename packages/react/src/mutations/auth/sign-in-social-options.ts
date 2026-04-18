import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for social sign-in.
 *
 * The returned `mutationKey` (`["auth", "signIn", "social"]`) is stable and
 * can be passed to `useIsMutating` or matched inside a global
 * `MutationCache` observer for toast handling.
 *
 * @param authClient - The Better Auth client.
 */
export function signInSocialOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signIn.social, [
    "auth",
    "signIn",
    "social"
  ])
}
