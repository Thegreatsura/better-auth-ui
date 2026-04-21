import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { MultiSessionAuthClient } from "../../lib/auth-client"
import {
  type SetActiveSessionOptions,
  setActiveSessionOptions
} from "../../mutations/multi-session/set-active-session-options"
import {
  type SessionData,
  sessionOptions
} from "../../queries/auth/session-options"
import { useSession } from "../auth/use-session"
import { useListDeviceSessions } from "./use-list-device-sessions"

/**
 * Hook that sets an active device session in multi-session mode.
 *
 * Optimistically switches the cached session to the matching device session,
 * scrolls to top, and refetches both the session and device-session queries.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSetActiveSession<TAuthClient extends MultiSessionAuthClient>(
  authClient: TAuthClient,
  options?: SetActiveSessionOptions<TAuthClient>
) {
  const queryClient = useQueryClient()
  const { refetch: refetchSession } = useSession(authClient, {
    refetchOnMount: false
  })
  const { data: deviceSessions, refetch: refetchDeviceSessions } =
    useListDeviceSessions(authClient, {
      refetchOnMount: false
    })

  return useMutation({
    ...options,
    ...setActiveSessionOptions(authClient),
    onSuccess: async (data, variables, ...rest) => {
      const sessionToken = variables?.sessionToken
      const deviceSession = deviceSessions?.find(
        ({ session: { token } }) => token === sessionToken
      )

      if (deviceSession) {
        queryClient.setQueryData(
          sessionOptions(authClient).queryKey,
          deviceSession as SessionData<TAuthClient>
        )
      }

      window.scrollTo({ top: 0 })

      await refetchSession()
      await refetchDeviceSessions()
      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
