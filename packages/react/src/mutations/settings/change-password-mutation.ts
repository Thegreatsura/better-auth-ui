import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type ChangePasswordParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["changePassword"]
>[0]

type ChangePasswordOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof changePasswordOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for changing the authenticated user's password.
 *
 * @param authClient - The Better Auth client.
 */
export function changePasswordOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "changePassword"]

  const mutationFn = (params: ChangePasswordParams<TAuthClient>) =>
    authClient.changePassword({
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
 * Hook that creates a mutation for changing the authenticated user's password.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useChangePassword<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ChangePasswordOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...changePasswordOptions(authClient)
  })
}
