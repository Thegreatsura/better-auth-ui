import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/session-options"
import {
  type UseAuthMutationOptions,
  type UseAuthMutationResult,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useSession } from "../auth/use-session"

/**
 * Hook that creates a mutation for updating the authenticated user's profile.
 *
 * The mutation submits the name update, refetches the session on success,
 * and displays success or error toasts.
 *
 * @returns The `useMutation` result.
 */
export function useUpdateUser(
  options?: UseAuthMutationOptions<AuthClient["updateUser"]>
): UseAuthMutationResult<AuthClient["updateUser"]> {
  const { authClient } = useAuth()
  const { data: session, refetch: refetchSession } = useSession(undefined, {
    refetchOnMount: false
  })
  const queryClient = useQueryClient()

  return useAuthMutation({
    authFn: authClient.updateUser,
    options: {
      ...options,
      onSuccess: async (data, variables, ...rest) => {
        if (session) {
          queryClient.setQueryData(sessionOptions(authClient).queryKey, {
            ...session,
            user: { ...session.user, ...variables }
          })
        }

        refetchSession()

        await options?.onSuccess?.(data, variables, ...rest)
      }
    }
  })
}
