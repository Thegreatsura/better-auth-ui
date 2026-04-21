import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"

export type DeletePasskeyParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["passkey"]["deletePasskey"]>[0]

export type DeletePasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof deletePasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for deleting a passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function deletePasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "passkey", "deletePasskey"]

  const mutationFn = (params: DeletePasskeyParams<TAuthClient>) =>
    authClient.passkey.deletePasskey({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    Parameters<typeof mutationFn>[0]
  >({
    mutationKey,
    mutationFn
  })
}
