import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type SignUpEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signUp"]["email"]
>[0]

export type SignUpEmailOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signUpEmailOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for email/password sign-up.
 *
 * @param authClient - The Better Auth client.
 */
export function signUpEmailOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signUp", "email"]

  const mutationFn = (params: SignUpEmailParams<TAuthClient>) =>
    authClient.signUp.email({
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
