import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { revokeMultiSessionOptions } from "../../mutations/multi-session/revoke-multi-session-options"
import { useListDeviceSessions } from "./use-list-device-sessions"

export type UseRevokeMultiSessionParams = NonNullable<
  Parameters<MultiSessionAuthClient["multiSession"]["revoke"]>[0]
>

export type UseRevokeMultiSessionOptions = Omit<
  ReturnType<typeof revokeMultiSessionOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for revoking a device session in multi-session mode.
 *
 * Refetches the device sessions list on success.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useRevokeMultiSession(options?: UseRevokeMultiSessionOptions) {
  const { authClient } = useAuth()
  const multiSessionAuthClient = authClient as MultiSessionAuthClient
  const { refetch } = useListDeviceSessions(multiSessionAuthClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...revokeMultiSessionOptions(multiSessionAuthClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
