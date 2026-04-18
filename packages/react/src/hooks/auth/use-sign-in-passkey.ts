import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/auth/session-options"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "./use-auth-mutation"

/**
 * Hook that creates a mutation for passkey sign-in.
 *
 * The mutation sends a passkey sign-in request and
 * refetches the session on completion.
 *
 * @returns The `useMutation` result.
 */
export function useSignInPasskey(
  options?: UseAuthMutationOptions<AuthClient["signIn"]["passkey"]>
) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()

  return useAuthMutation({
    authFn: authClient.signIn.passkey,
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
