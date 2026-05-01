import { authMutationKeys } from "@better-auth-ui/core"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { UsernameAuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

export type SignInUsernameParams<TAuthClient extends UsernameAuthClient> =
  Parameters<TAuthClient["signIn"]["username"]>[0]

export type SignInUsernameOptions<TAuthClient extends UsernameAuthClient> =
  Omit<
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
  const mutationKey = authMutationKeys.signIn.username

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
 * Create a mutation for username/password sign-in.
 *
 * Wraps `authClient.signIn.username`, resets the session query on success so
 * the new session is refetched, and forwards React Query mutation options
 * such as `onSuccess`, `onError`, and `retry`.
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
    ...signInUsernameOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
