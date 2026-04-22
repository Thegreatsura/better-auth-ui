import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type SendVerificationEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["sendVerificationEmail"]
>[0]

type SendVerificationEmailOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof sendVerificationEmailOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for sending a verification email.
 *
 * @param authClient - The Better Auth client.
 */
export function sendVerificationEmailOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "sendVerificationEmail"]

  const mutationFn = (params: SendVerificationEmailParams<TAuthClient>) =>
    authClient.sendVerificationEmail({
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
 * Hook that creates a mutation to send a verification email.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSendVerificationEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SendVerificationEmailOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...sendVerificationEmailOptions(authClient)
  })
}
