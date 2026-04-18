import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { updateUserOptions } from "../../mutations/settings/update-user-options"
import { sessionOptions } from "../../queries/auth/session-options"
import { useSession } from "../auth/use-session"

export type UseUpdateUserParams = NonNullable<
  Parameters<AuthClient["updateUser"]>[0]
>

export type UseUpdateUserOptions = Omit<
  ReturnType<typeof updateUserOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for updating the authenticated user's profile.
 *
 * Optimistically merges the update into the cached session, then refetches
 * the session to reconcile with the server.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useUpdateUser(options?: UseUpdateUserOptions) {
  const { authClient } = useAuth()
  const { data: session, refetch: refetchSession } = useSession({
    refetchOnMount: false
  })
  const queryClient = useQueryClient()

  return useMutation({
    ...updateUserOptions(authClient),
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
  })
}
