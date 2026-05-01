import { passkeyMutationKeys } from "@better-auth-ui/core/plugins"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

export type SignInPasskeyParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["signIn"]["passkey"]>[0]

export type SignInPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof signInPasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for passkey sign-in.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 */
export function signInPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = passkeyMutationKeys.signIn

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: SignInPasskeyParams<TAuthClient> | void) =>
    authClient.signIn.passkey({
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
 * Create a mutation for passkey sign-in.
 *
 * Wraps `authClient.signIn.passkey`, resets the session query on success so
 * the new session is refetched, and forwards React Query mutation options
 * such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInPasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: SignInPasskeyOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...signInPasskeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
