import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useListSessions } from "./use-list-sessions"

/**
 * Hook that creates a mutation for revoking a user session.
 *
 * @returns The `useMutation` result.
 */
export function useRevokeSession(
  options?: UseAuthMutationOptions<AuthClient["revokeSession"]>
) {
  const { authClient } = useAuth()
  const { refetch } = useListSessions({ refetchOnMount: false })

  return useAuthMutation({
    authFn: authClient.revokeSession,
    options: {
      ...options,
      onSuccess: async (...args) => {
        await refetch()
        await options?.onSuccess?.(...args)
      }
    }
  })
}
