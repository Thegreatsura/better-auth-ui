import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type SignInEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signIn"]["email"]
>[0]

export type SignInEmailOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signInEmailOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for email/password sign-in.
 *
 * The returned `mutationKey` (`["auth", "signIn", "email"]`) is stable and
 * can be passed to `useIsMutating` or matched inside a global
 * `MutationCache` observer for toast handling.
 *
 * @param authClient - The Better Auth client.
 */
export function signInEmailOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "email"]

  const mutationFn = (params: SignInEmailParams<TAuthClient>) =>
    authClient.signIn.email({
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
