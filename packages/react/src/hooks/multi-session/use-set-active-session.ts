import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { setActiveSessionOptions } from "../../mutations/multi-session/set-active-session-options"
import { sessionOptions } from "../../queries/auth/session-options"
import { useSession } from "../auth/use-session"
import { useListDeviceSessions } from "./use-list-device-sessions"

export type UseSetActiveSessionParams = NonNullable<
  Parameters<MultiSessionAuthClient["multiSession"]["setActive"]>[0]
>

export type UseSetActiveSessionOptions = Omit<
  ReturnType<typeof setActiveSessionOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that sets an active device session in multi-session mode.
 *
 * Optimistically switches the cached session to the matching device session,
 * scrolls to top, and refetches both the session and device-session queries.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSetActiveSession(options?: UseSetActiveSessionOptions) {
  const queryClient = useQueryClient()
  const { authClient } = useAuth()
  const multiSessionAuthClient = authClient as MultiSessionAuthClient
  const { refetch: refetchSession } = useSession(authClient, {
    refetchOnMount: false
  })
  const { data: deviceSessions, refetch: refetchDeviceSessions } =
    useListDeviceSessions(multiSessionAuthClient, { refetchOnMount: false })

  return useMutation({
    ...setActiveSessionOptions(multiSessionAuthClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      const sessionToken = variables?.sessionToken
      const deviceSession = deviceSessions?.find(
        (session) => session.session.token === sessionToken
      )

      if (deviceSession) {
        queryClient.setQueryData(
          sessionOptions(authClient).queryKey,
          deviceSession
        )
      }

      window.scrollTo({ top: 0 })

      await refetchSession()
      await refetchDeviceSessions()
      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
