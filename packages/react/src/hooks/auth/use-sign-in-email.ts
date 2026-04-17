import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for email/password sign-in.
 *
 * The mutation sends an email/password sign-in request and
 * refetches the session on completion.
 *
 * @returns The `useMutation` result.
 */
export function useSignInEmail(
  options?: UseAuthMutationOptions<AuthClient["signIn"]["email"]>
) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()

  return useAuthMutation({
    authFn: authClient.signIn.email,
    options: {
      ...options,
      onSuccess: async (...args) => {
        queryClient.resetQueries({ queryKey: ["auth", "getSession"] })
        await options?.onSuccess?.(...args)
      }
    }
  })
}
