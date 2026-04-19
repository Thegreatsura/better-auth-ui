import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { signInUsernameOptions } from "../../mutations/username/sign-in-username-options"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSignInUsernameParams = NonNullable<
  Parameters<AuthClient["signIn"]["username"]>[0]
>

export type UseSignInUsernameOptions = Omit<
  ReturnType<typeof signInUsernameOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for username/password sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInUsername(options?: UseSignInUsernameOptions) {
  const { authClient } = useAuth()
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
