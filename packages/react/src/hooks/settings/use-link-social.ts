import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"

/**
 * Hook that creates a mutation for linking a social provider to the current user.
 *
 * @returns The `useMutation` result.
 */
export function useLinkSocial(
  options?: UseAuthMutationOptions<AuthClient["linkSocial"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({ authFn: authClient.linkSocial, options })
}
