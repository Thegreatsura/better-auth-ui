import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for revoking a user session.
 *
 * @param authClient - The Better Auth client.
 */
export function revokeSessionOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.revokeSession, [
    "auth",
    "revokeSession"
  ])
}
