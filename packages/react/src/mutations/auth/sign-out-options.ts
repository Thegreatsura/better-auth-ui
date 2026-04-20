import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type AuthMutationOptions,
  authMutationOptions
} from "../auth-mutation-options"

/**
 * Mutation options factory for signing out.
 *
 * @param authClient - The Better Auth client.
 * @param options - Extra `useMutation` options (`onSuccess`, `onError`, etc.).
 */
export function signOutOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: AuthMutationOptions<TAuthClient["signOut"]>
) {
  return authMutationOptions(
    authClient.signOut as TAuthClient["signOut"],
    ["auth", "signOut"],
    options
  )
}
