import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { signInPasskeyOptions } from "../../mutations/auth/sign-in-passkey-options"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSignInPasskeyParams = NonNullable<
  Parameters<AuthClient["signIn"]["passkey"]>[0]
>

export type UseSignInPasskeyOptions = Omit<
  ReturnType<typeof signInPasskeyOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for passkey sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInPasskey(options?: UseSignInPasskeyOptions) {
  const { authClient } = useAuth()
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
