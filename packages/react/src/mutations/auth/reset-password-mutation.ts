import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type ResetPasswordParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["resetPassword"]
>[0]

type ResetPasswordOptions<TAuthClient extends AuthClient> = Omit<
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

/**
 * Hook that creates a mutation for the reset-password flow.
 *
 * Resets the user's password using the provided token and new password.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useResetPassword<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ResetPasswordOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...resetPasswordOptions(authClient)
  })
}
