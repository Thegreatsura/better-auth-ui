import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listDeviceSessionsOptions } from "../../queries/list-device-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListDeviceSessionsOptions = Omit<
  ReturnType<typeof listDeviceSessionsOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve device sessions for multi-session account switching.
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param params - Parameters forwarded to `authClient.multiSession.listDeviceSessions`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the device sessions list.
 */
export function useListDeviceSessions(
  params?: Parameters<AuthClient["multiSession"]["listDeviceSessions"]>[0],
  options?: UseListDeviceSessionsOptions
) {
  const { authClient } = useAuth()
  const { data: session } = useSession(undefined, { refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  return useQuery({
    ...listDeviceSessionsOptions(authClient, userId, params),
    ...(disabled && { queryFn: skipToken }),
    ...options
  })
}
