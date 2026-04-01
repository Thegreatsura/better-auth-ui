import {
  type AuthClient,
  useAuth,
  useAuthMutation
} from "@better-auth-ui/react"
import type { UseAuthMutationOptions } from "../auth/use-auth-mutation"

export { useAuthMutation } from "../auth/use-auth-mutation"

/**
 * Hook that creates a mutation for deleting the authenticated user account.
 *
 * @returns The `useMutation` result.
 */
export function useDeleteUser(
  options?: UseAuthMutationOptions<AuthClient["deleteUser"]>
) {
  const { authClient } = useAuth()
  return useAuthMutation({ authFn: authClient.deleteUser, options })
}
