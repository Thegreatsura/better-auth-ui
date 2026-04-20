import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type SignOutOptions,
  signOutOptions
} from "../../mutations/auth/sign-out-options"

/**
 * Hook that creates a mutation for signing out.
 *
 * Removes all cached auth queries on completion.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignOut<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignOutOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signOutOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.removeQueries({ queryKey: ["auth"] })
      await options?.onSuccess?.(...args)
    }
  })
}
