import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for social sign-in.
 *
 * The mutation initiates a social sign-in flow with the specified provider.
 *
 * @returns The `useMutation` result.
 */
export function useSignInSocial(
  options?: UseAuthMutationOptions<AuthClient["signIn"]["social"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.signIn.social, options })
}
