import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type UpdateUserOptions,
  updateUserOptions
} from "../../mutations/settings/update-user-options"
import { sessionOptions } from "../../queries/auth/session-options"
import { useSession } from "../auth/use-session"

/**
 * `useMutation` hook for updating the authenticated user's profile.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useUpdateUser<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UpdateUserOptions<TAuthClient>
) {
  const { data: session, refetch: refetchSession } = useSession(
    authClient as AuthClient,
    {
      refetchOnMount: false
    }
  )
  const queryClient = useQueryClient()

  return useMutation({
    ...updateUserOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      if (session) {
        queryClient.setQueryData(
          sessionOptions(authClient as AuthClient).queryKey,
          {
            ...session,
            user: { ...session.user, ...variables }
          }
        )
      }

      refetchSession()

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
