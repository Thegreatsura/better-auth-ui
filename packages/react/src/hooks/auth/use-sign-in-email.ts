import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { signInEmailOptions } from "../../mutations/auth/sign-in-email-options"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSignInEmailOptions = Omit<
  ReturnType<typeof signInEmailOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for email/password sign-in.
 *
 * The mutation sends an email/password sign-in request and
 * refetches the session on completion.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInEmail(options?: UseSignInEmailOptions) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    ...signInEmailOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
