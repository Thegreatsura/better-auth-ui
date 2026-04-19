import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for switching the active device session.
 *
 * @param authClient - The Better Auth client.
 */
export function setActiveSessionOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.multiSession.setActive, [
    "auth",
    "multiSession",
    "setActive"
  ])
}
