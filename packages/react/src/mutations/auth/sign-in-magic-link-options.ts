import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for magic-link sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInMagicLinkOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.signIn.magicLink, [
    "auth",
    "signIn",
    "magicLink"
  ])
}
