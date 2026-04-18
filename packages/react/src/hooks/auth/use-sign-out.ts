import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { signOutOptions } from "../../mutations/auth/sign-out-options"

export type UseSignOutOptions = Omit<
  ReturnType<typeof signOutOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for signing out.
 *
 * Removes all cached auth queries on completion.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignOut(options?: UseSignOutOptions) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    ...signOutOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      queryClient.removeQueries({ queryKey: ["auth"] })
      await options?.onSuccess?.(...args)
    }
  })
}
