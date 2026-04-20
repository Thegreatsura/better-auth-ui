import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { UsernameAuthClient } from "../../lib/auth-clients/username-auth-client"

export type SignInUsernameParams<TAuthClient extends UsernameAuthClient> =
  Parameters<TAuthClient["signIn"]["username"]>[0]

export type SignInUsernameOptions<TAuthClient extends UsernameAuthClient> =
  Omit<
    ReturnType<typeof signInUsernameOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

/**
 * Mutation options factory for username/password sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInUsernameOptions<TAuthClient extends UsernameAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "username"]

  const mutationFn = (params: SignInUsernameParams<TAuthClient>) =>
    authClient.signIn.username({
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
