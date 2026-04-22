import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { MultiSessionAuthClient } from "../../lib/auth-client"
import { useListDeviceSessions } from "../../queries/multi-session/list-device-sessions-query"
import {
  type SessionData,
  sessionOptions,
  useSession
} from "../../queries/auth/session-query"

export type SetActiveSessionParams<TAuthClient extends MultiSessionAuthClient> =
  Parameters<TAuthClient["multiSession"]["setActive"]>[0]

type SetActiveSessionOptions<TAuthClient extends MultiSessionAuthClient> = Omit<
  ReturnType<typeof setActiveSessionOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for switching the active device session.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 */
export function setActiveSessionOptions<
  TAuthClient extends MultiSessionAuthClient
>(authClient: TAuthClient) {
  const mutationKey = ["auth", "multiSession", "setActive"]

  const mutationFn = (params: SetActiveSessionParams<TAuthClient>) =>
    authClient.multiSession.setActive({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    Parameters<typeof mutationFn>[0]
  >({
    mutationKey,
    mutationFn
  })
}

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
