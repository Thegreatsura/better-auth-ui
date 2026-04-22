import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { UsernameAuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

export type SignInUsernameParams<TAuthClient extends UsernameAuthClient> = Parameters<
  TAuthClient["signIn"]["username"]
>[0]

type SignInUsernameOptions<TAuthClient extends UsernameAuthClient> = Omit<
  ReturnType<typeof signInUsernameOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for username/password sign-in.
 *
 * @param authClient - The Better Auth client.
 */
export function signInUsernameOptions<TAuthClient extends UsernameAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signIn", "username"]

  const mutationFn = (params: SignInUsernameParams<TAuthClient>) =>
    authClient.signIn.username({
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
 * Hook that creates a mutation for username/password sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param authClient - The Better Auth client with the username plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInUsername<TAuthClient extends UsernameAuthClient>(
  authClient: TAuthClient,
  options?: SignInUsernameOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signInUsernameOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
