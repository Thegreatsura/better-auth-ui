import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"

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
