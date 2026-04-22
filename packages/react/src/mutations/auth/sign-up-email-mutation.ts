import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

export type SignUpEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signUp"]["email"]
>[0]

type SignUpEmailOptions<TAuthClient extends AuthClient> = Omit<
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

/**
 * Create a mutation for email/password sign-up.
 *
 * Wraps `authClient.signUp.email`, resets the session query on success so
 * the new session is refetched, and forwards React Query mutation options
 * such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignUpEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignUpEmailOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...signUpEmailOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
