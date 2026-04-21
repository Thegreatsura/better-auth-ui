import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { MagicLinkAuthClient } from "../../lib/auth-client"

export type SignInMagicLinkParams<TAuthClient extends MagicLinkAuthClient> =
  Parameters<TAuthClient["signIn"]["magicLink"]>[0]

export type SignInMagicLinkOptions<TAuthClient extends MagicLinkAuthClient> =
  Omit<
    ReturnType<typeof signInMagicLinkOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

/**
 * Mutation options factory for magic-link sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInMagicLinkOptions<TAuthClient extends MagicLinkAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "magicLink"]

  const mutationFn = (params: SignInMagicLinkParams<TAuthClient>) =>
    authClient.signIn.magicLink({
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
