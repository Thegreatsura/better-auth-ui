import { useMutation } from "@tanstack/react-query"

import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import {
  type RevokeMultiSessionOptions,
  revokeMultiSessionOptions
} from "../../mutations/multi-session/revoke-multi-session-options"
import { useListDeviceSessions } from "./use-list-device-sessions"

/**
 * Hook that creates a mutation for revoking a device session in multi-session mode.
 *
 * Refetches the device sessions list on success.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRevokeMultiSession<
  TAuthClient extends MultiSessionAuthClient
>(authClient: TAuthClient, options?: RevokeMultiSessionOptions<TAuthClient>) {
  const { refetch } = useListDeviceSessions(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...options,
    ...revokeMultiSessionOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
