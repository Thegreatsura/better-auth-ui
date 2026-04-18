import { useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/session-options"
import {
  type UseAuthMutationOptions,
  useAuthMutation
} from "../auth/use-auth-mutation"
import { useSession } from "../auth/use-session"
import { useListDeviceSessions } from "./use-list-device-sessions"

/**
 * Hook that sets an active device session in multi-session mode.
 *
 * @returns The `useMutation` result.
 */
export function useSetActiveSession(
  options?: UseAuthMutationOptions<AuthClient["multiSession"]["setActive"]>
) {
  const queryClient = useQueryClient()
  const { authClient } = useAuth()
  const { refetch: refetchSession } = useSession(undefined, {
    refetchOnMount: false
  })
  const { data: deviceSessions, refetch: refetchDeviceSessions } =
    useListDeviceSessions(undefined, { refetchOnMount: false })

  return useAuthMutation({
    authFn: authClient.multiSession.setActive,
    options: {
      ...options,
      onSuccess: async (data, { sessionToken }, ...args) => {
        const deviceSession = deviceSessions?.find(
          (session) => session.session.token === sessionToken
        )

        if (deviceSession)
          queryClient.setQueryData(
            sessionOptions(authClient).queryKey,
            deviceSession
          )

        window.scrollTo({ top: 0 })

        await refetchSession()
        await refetchDeviceSessions()
        await options?.onSuccess?.(data, { sessionToken }, ...args)
      }
    }
  })
}
