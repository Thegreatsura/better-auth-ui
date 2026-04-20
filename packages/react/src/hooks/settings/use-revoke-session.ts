import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { revokeSessionOptions } from "../../mutations/settings/revoke-session-options"
import { useListSessions } from "./use-list-sessions"

export type UseRevokeSessionParams = NonNullable<
  Parameters<AuthClient["revokeSession"]>[0]
>

export type UseRevokeSessionOptions = Omit<
  ReturnType<typeof revokeSessionOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for revoking a user session.
 *
 * Refetches the sessions list on success.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useRevokeSession(options?: UseRevokeSessionOptions) {
  const { authClient } = useAuth()
  const { refetch: refetchSessions } = useListSessions(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...revokeSessionOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetchSessions()
      await options?.onSuccess?.(...args)
    }
  })
}
