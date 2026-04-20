import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { signOutOptions } from "../../mutations/auth/sign-out-options"

export type UseSignOutParams<TAuthClient extends AuthClient> = NonNullable<
  Parameters<TAuthClient["signOut"]>[0]
>

export type UseSignOutOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signOutOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for signing out.
 *
 * Removes all cached auth queries on completion.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignOut<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UseSignOutOptions<TAuthClient>
) {
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
