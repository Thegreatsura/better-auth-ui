import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation to send a verification email.
 *
 * The mutation sends a verification email to the specified email address.
 *
 * @returns The `useMutation` result.
 */
export function useSendVerificationEmail(
  options?: UseAuthMutationOptions<AuthClient["sendVerificationEmail"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.sendVerificationEmail, options })
}
