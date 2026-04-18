import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/session-options"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for email/password sign-up.
 *
 * The mutation sends an email/password sign-up request and
 * refetches the session on success.
 *
 * @returns The `useMutation` result.
 */
export function useSignUpEmail(
  options?: UseAuthMutationOptions<AuthClient["signUp"]["email"]>
) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()

  return useAuthMutation({
    authFn: authClient.signUp.email,
    options: {
      ...options,
      onSuccess: async (...args) => {
        queryClient.resetQueries({
          queryKey: sessionOptions(authClient).queryKey
        })

        await options?.onSuccess?.(...args)
      }
    }
  })
}
