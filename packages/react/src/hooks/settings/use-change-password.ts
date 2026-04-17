import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"

/**
 * Hook that creates a mutation for changing the authenticated user's password.
 *
 * @returns The `useMutation` result.
 */
export function useChangePassword(
  options?: UseAuthMutationOptions<AuthClient["changePassword"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.changePassword, options })
}
