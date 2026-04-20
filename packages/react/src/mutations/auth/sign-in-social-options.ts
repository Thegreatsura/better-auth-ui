import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-clients/auth-client"

export type SignInSocialParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signIn"]["social"]
>[0]

export type SignInSocialOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signInSocialOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for social sign-in.
 *
 * The returned `mutationKey` (`["auth", "signIn", "social"]`) is stable and
 * can be passed to `useIsMutating` or matched inside a global
 * `MutationCache` observer for toast handling.
 *
 * @param authClient - The Better Auth client.
 */
export function signInSocialOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "social"]

  const mutationFn = (params: SignInSocialParams<TAuthClient>) =>
    authClient.signIn.social({
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
