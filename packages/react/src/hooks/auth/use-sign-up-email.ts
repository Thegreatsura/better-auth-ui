import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { signUpEmailOptions } from "../../mutations/auth/sign-up-email-options"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSignUpEmailParams = NonNullable<
  Parameters<AuthClient["signUp"]["email"]>[0]
>

export type UseSignUpEmailOptions = Omit<
  ReturnType<typeof signUpEmailOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for email/password sign-up.
 *
 * Resets the session query on success so the new session is refetched.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignUpEmail(options?: UseSignUpEmailOptions) {
  const { authClient } = useAuth()
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
