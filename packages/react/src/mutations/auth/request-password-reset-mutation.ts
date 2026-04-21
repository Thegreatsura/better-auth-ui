import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

type RequestPasswordResetParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["requestPasswordReset"]
>[0]

type RequestPasswordResetOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof requestPasswordResetOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for requesting a password reset email.
 *
 * @param authClient - The Better Auth client.
 */
export function requestPasswordResetOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "requestPasswordReset"]

  const mutationFn = (params: RequestPasswordResetParams<TAuthClient>) =>
    authClient.requestPasswordReset({
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
 * Hook that creates a mutation for the forgot-password flow.
 *
 * Sends a password reset email for the provided address.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRequestPasswordReset<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: RequestPasswordResetOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...requestPasswordResetOptions(authClient)
  })
}
