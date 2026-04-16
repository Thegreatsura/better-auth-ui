import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useListUserPasskeys } from "./use-list-user-passkeys"

/**
 * Hook that creates a mutation for deleting a passkey.
 *
 * Refetches the passkeys list on success.
 *
 * @returns The `useMutation` result.
 */
export function useDeletePasskey(
  options?: UseAuthMutationOptions<AuthClient["passkey"]["deletePasskey"]>
) {
  const { authClient } = useAuth()
  const { refetch } = useListUserPasskeys()

  return useAuthMutation({
    authFn: authClient.passkey.deletePasskey,
    options: {
      ...options,
      onSuccess: async (...args) => {
        await refetch()
        await options?.onSuccess?.(...args)
      }
    }
  })
}
