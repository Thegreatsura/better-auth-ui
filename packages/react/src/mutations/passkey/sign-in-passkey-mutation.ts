import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-query"

type SignInPasskeyParams<TAuthClient extends PasskeyAuthClient> = Parameters<
  TAuthClient["signIn"]["passkey"]
>[0]

type SignInPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
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
  const mutationKey = ["auth", "signIn", "passkey"]

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
 * Hook that creates a mutation for passkey sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
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
    ...options,
    ...signInPasskeyOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
