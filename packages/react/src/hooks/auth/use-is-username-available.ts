import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation to check if a username is available.
 *
 * @returns The `useMutation` result where data contains `{ available: boolean }`.
 */
export function useIsUsernameAvailable(
  options?: UseAuthMutationOptions<AuthClient["isUsernameAvailable"]>
) {
  const { authClient } = useAuth()

  return useAuthMutation({
    authFn: authClient.isUsernameAvailable,
    options
  })
}
