import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UsernameAuthClient } from "../../lib/auth-clients/username-auth-client"
import {
  type SignInUsernameOptions,
  signInUsernameOptions
} from "../../mutations/username/sign-in-username-options"
import { sessionOptions } from "../../queries/auth/session-options"

/**
 * Hook that creates a mutation for username/password sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param authClient - The Better Auth client with the username plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInUsername<TAuthClient extends UsernameAuthClient>(
  authClient: TAuthClient,
  options?: SignInUsernameOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signInUsernameOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
