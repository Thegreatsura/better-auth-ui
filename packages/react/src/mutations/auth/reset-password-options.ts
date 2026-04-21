import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type ResetPasswordParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["resetPassword"]
>[0]

export type ResetPasswordOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof resetPasswordOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for completing a password reset.
 *
 * @param authClient - The Better Auth client.
 */
export function resetPasswordOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "resetPassword"]

  const mutationFn = (params: ResetPasswordParams<TAuthClient>) =>
    authClient.resetPassword({
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
