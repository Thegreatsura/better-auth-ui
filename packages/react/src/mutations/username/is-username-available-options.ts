import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { authMutationOptions } from "../auth-mutation-options"

/**
 * Mutation options factory for checking username availability.
 *
 * Modeled as a mutation because callers typically trigger the check on
 * user action (debounced input, form submit) rather than on mount.
 *
 * @param authClient - The Better Auth client.
 */
export function isUsernameAvailableOptions(authClient: AuthClient) {
  return authMutationOptions<
    typeof authClient.isUsernameAvailable,
    ["auth", "isUsernameAvailable"],
    { available: boolean; message: string | null }
  >(authClient.isUsernameAvailable, ["auth", "isUsernameAvailable"])
}
