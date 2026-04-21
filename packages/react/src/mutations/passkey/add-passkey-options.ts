import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"

export type AddPasskeyParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["passkey"]["addPasskey"]>[0]

export type AddPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof addPasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for registering a new passkey.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 */
export function addPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "passkey", "addPasskey"]

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: AddPasskeyParams<TAuthClient> | void) =>
    authClient.passkey.addPasskey({
      ...(params ?? {}),
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
