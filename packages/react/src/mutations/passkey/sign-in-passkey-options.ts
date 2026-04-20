import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import {
  type AuthMutationOptions,
  authMutationOptions
} from "../auth-mutation-options"

/**
 * Mutation options factory for passkey sign-in.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - Extra `useMutation` options (`onSuccess`, `onError`, etc.).
 */
export function signInPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: AuthMutationOptions<TAuthClient["signIn"]["passkey"]>
) {
  return authMutationOptions(
    authClient.signIn.passkey as TAuthClient["signIn"]["passkey"],
    ["auth", "signIn", "passkey"],
    options
  )
}
