import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for changing the current user's email address.
 *
 * @param authClient - The Better Auth client.
 */
export function changeEmailOptions(authClient: AuthClient) {
  return authMutationOptions(authClient.changeEmail, ["auth", "changeEmail"])
}
