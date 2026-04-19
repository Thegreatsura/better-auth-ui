import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { revokeMultiSessionOptions } from "../../mutations/multi-session/revoke-multi-session-options"
import { useListDeviceSessions } from "./use-list-device-sessions"

export type UseRevokeMultiSessionParams = NonNullable<
  Parameters<AuthClient["multiSession"]["revoke"]>[0]
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
  const { refetch } = useListDeviceSessions({
    refetchOnMount: false
  })

  return useMutation({
    ...revokeMultiSessionOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
