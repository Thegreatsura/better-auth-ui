import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for the reset-password flow.
 *
 * The mutation resets the user's password using the provided token and new password.
 *
 * @returns The `useMutation` result.
 */
export function useResetPassword(
  options?: UseAuthMutationOptions<AuthClient["resetPassword"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.resetPassword, options })
}
