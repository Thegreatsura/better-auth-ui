import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type SignInEmailOptions,
  signInEmailOptions
} from "../../mutations/auth/sign-in-email-options"
import { sessionOptions } from "../../queries/auth/session-options"

/**
 * Hook that creates a mutation for email/password sign-in.
 *
 * The mutation sends an email/password sign-in request and
 * refetches the session on completion.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignInEmailOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signInEmailOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
