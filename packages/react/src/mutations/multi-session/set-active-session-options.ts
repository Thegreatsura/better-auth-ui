import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for switching the active device session.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 */
export function setActiveSessionOptions(authClient: MultiSessionAuthClient) {
  return authMutationOptions(authClient.multiSession.setActive, [
    "auth",
    "multiSession",
    "setActive"
  ])
}
