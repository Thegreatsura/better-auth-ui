import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { signInPasskeyOptions } from "../../mutations/passkey/sign-in-passkey-options"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSignInPasskeyParams<TAuthClient extends PasskeyAuthClient> =
  NonNullable<Parameters<TAuthClient["signIn"]["passkey"]>[0]>

export type UseSignInPasskeyOptions<TAuthClient extends PasskeyAuthClient> =
  Omit<
    ReturnType<typeof signInPasskeyOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

/**
 * Hook that creates a mutation for passkey sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInPasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: UseSignInPasskeyOptions<TAuthClient>
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
