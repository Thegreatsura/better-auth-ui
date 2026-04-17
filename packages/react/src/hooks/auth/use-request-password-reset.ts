import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for the forgot-password flow.
 *
 * The mutation sends a password reset request for the submitted email,
 * and navigates to the sign-in view on success.
 *
 * @returns The `useMutation` result.
 */
export function useRequestPasswordReset(
  options?: UseAuthMutationOptions<AuthClient["requestPasswordReset"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.requestPasswordReset, options })
}
