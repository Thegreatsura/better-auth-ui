import type { AuthClient } from "../../lib/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for revoking a device session in multi-session mode.
 *
 * @param authClient - The Better Auth client.
 */
export function revokeMultiSessionOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.multiSession.revoke, [
    "auth",
    "multiSession",
    "revoke"
  ])
}
