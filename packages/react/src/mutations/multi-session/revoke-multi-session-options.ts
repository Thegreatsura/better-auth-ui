import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for revoking a device session in multi-session mode.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 */
export function revokeMultiSessionOptions(authClient: MultiSessionAuthClient) {
  return authMutationOptions(authClient.multiSession.revoke, [
    "auth",
    "multiSession",
    "revoke"
  ])
}
