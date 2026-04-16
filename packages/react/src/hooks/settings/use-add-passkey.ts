import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useListUserPasskeys } from "./use-list-user-passkeys"

/**
 * Hook that creates a mutation for adding a new passkey.
 *
 * Refetches the passkeys list on success.
 *
 * @returns The `useMutation` result.
 */
export function useAddPasskey(
  options?: UseAuthMutationOptions<AuthClient["passkey"]["addPasskey"]>
) {
  const { authClient } = useAuth()
  const { refetch } = useListUserPasskeys()

  return useAuthMutation({
    authFn: authClient.passkey.addPasskey,
    options: {
      ...options,
      onSuccess: async (...args) => {
        await refetch()
        await options?.onSuccess?.(...args)
      }
    }
  })
}
