import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for linking a social provider to the current user.
 *
 * @param authClient - The Better Auth client.
 */
export function linkSocialOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.linkSocial, ["auth", "linkSocial"])
}
