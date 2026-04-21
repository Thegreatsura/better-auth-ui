import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type RevokeSessionOptions,
  revokeSessionOptions
} from "../../mutations/settings/revoke-session-options"
import { useListSessions } from "./use-list-sessions"

/**
 * Hook that creates a mutation for revoking a user session.
 *
 * Refetches the sessions list on success.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRevokeSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: RevokeSessionOptions<TAuthClient>
) {
  const { refetch: refetchSessions } = useListSessions(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...options,
    ...revokeSessionOptions(authClient),
    onSuccess: async (...args) => {
      await refetchSessions()
      await options?.onSuccess?.(...args)
    }
  })
}
