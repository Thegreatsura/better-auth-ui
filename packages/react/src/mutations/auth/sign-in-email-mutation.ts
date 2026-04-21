import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

type SignInEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signIn"]["email"]
>[0]

type SignInEmailOptions<TAuthClient extends AuthClient> = Omit<
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

/**
 * Hook that creates a mutation for email/password sign-in.
 *
 * The mutation sends an email/password sign-in request and
 * refetches the session on completion.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignInEmailOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signInEmailOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
