import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for magic-link sign-in.
 *
 * The mutation sends a magic-link sign-in email to the specified address.
 *
 * @returns The `useMutation` result.
 */
export function useSignInMagicLink(
  options?: UseAuthMutationOptions<AuthClient["signIn"]["magicLink"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.signIn.magicLink, options })
}
