import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type SignUpEmailOptions,
  signUpEmailOptions
} from "../../mutations/auth/sign-up-email-options"
import { sessionOptions } from "../../queries/auth/session-options"

/**
 * Hook that creates a mutation for email/password sign-up.
 *
 * Resets the session query on success so the new session is refetched.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignUpEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignUpEmailOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signUpEmailOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
