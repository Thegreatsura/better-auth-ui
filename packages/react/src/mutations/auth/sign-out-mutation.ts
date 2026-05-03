import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type SignOutParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signOut"]
>[0]

export type SignOutOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signOutOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for signing out.
 *
 * @param authClient - The Better Auth client.
 */
export function signOutOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = authMutationKeys.signOut

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: SignOutParams<TAuthClient> | void) =>
    authClient.signOut({
      ...(params ?? {}),
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
 * Create a mutation for signing the current user out.
 *
 * Wraps `authClient.signOut`, removes all cached auth queries on success,
 * and forwards React Query mutation options such as `onSuccess`, `onError`,
 * and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignOut<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignOutOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...signOutOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
      await options?.onSuccess?.(...args)
    }
  })
}
