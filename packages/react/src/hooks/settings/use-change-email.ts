import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useSession } from "../auth/use-session"

/**
 * Hook that creates a mutation for changing the current user's email address.
 *
 * The mutation sends an email-change request and shows success or error toasts.
 * On success the callback URL is set to the account settings view.
 *
 * @returns The `useMutation` result.
 */
export function useChangeEmail(
  options?: UseAuthMutationOptions<AuthClient["changeEmail"]>
) {
  const { authClient } = useAuth()
  const { refetch } = useSession({ refetchOnMount: false })

  return useAuthMutation({
    authFn: authClient.changeEmail,
    options: {
      ...options,
      onSuccess: async (...args) => {
        refetch()
        await options?.onSuccess?.(...args)
      }
    }
  })
}
