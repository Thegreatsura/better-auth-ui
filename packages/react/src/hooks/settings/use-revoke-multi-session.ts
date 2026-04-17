import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useListDeviceSessions } from "./use-list-device-sessions"

/**
 * Hook that creates a mutation for revoking a device session in multi-session mode.
 *
 * @returns The `useMutation` result.
 */
export function useRevokeMultiSession(
  options?: UseAuthMutationOptions<AuthClient["multiSession"]["revoke"]>
) {
  const { authClient } = useAuth()
  const { refetch } = useListDeviceSessions({ refetchOnMount: false })

  return useAuthMutation({
    authFn: authClient.multiSession.revoke,
    options: {
      ...options,
      onSuccess: async (...args) => {
        await refetch()
        await options?.onSuccess?.(...args)
      }
    }
  })
}
