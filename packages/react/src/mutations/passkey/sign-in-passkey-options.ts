import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"

export type SignInPasskeyParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["signIn"]["passkey"]>[0]

export type SignInPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof signInPasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for passkey sign-in.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 */
export function signInPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "passkey"]

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: SignInPasskeyParams<TAuthClient> | void) =>
    authClient.signIn.passkey({
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
