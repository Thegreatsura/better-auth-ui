import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import {
  type AuthMutationOptions,
  authMutationOptions
} from "../auth-mutation-options"

/**
 * Mutation options factory for registering a new passkey.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - Extra `useMutation` options (`onSuccess`, `onError`, etc.).
 */
export function addPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: AuthMutationOptions<TAuthClient["passkey"]["addPasskey"]>
) {
  return authMutationOptions(
    authClient.passkey.addPasskey as TAuthClient["passkey"]["addPasskey"],
    ["auth", "passkey", "addPasskey"],
    options
  )
}
