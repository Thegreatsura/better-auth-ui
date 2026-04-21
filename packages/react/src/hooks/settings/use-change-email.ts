import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type ChangeEmailOptions,
  changeEmailOptions
} from "../../mutations/settings/change-email-options"
import { useSession } from "../auth/use-session"

/**
 * Hook that creates a mutation for changing the current user's email address.
 *
 * Refetches the session on success to surface the new email.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useChangeEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ChangeEmailOptions<TAuthClient>
) {
  const { refetch } = useSession(authClient, { refetchOnMount: false })

  return useMutation({
    ...options,
    ...changeEmailOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
