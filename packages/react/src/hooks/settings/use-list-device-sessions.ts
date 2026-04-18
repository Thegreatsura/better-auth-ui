import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listDeviceSessionsOptions } from "../../queries/settings/list-device-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListDeviceSessionsParams = NonNullable<
  Parameters<AuthClient["multiSession"]["listDeviceSessions"]>[0]
>

export type UseListDeviceSessionsOptions = Omit<
  ReturnType<typeof listDeviceSessionsOptions>,
  "queryKey" | "queryFn"
> &
  UseListDeviceSessionsParams

/**
 * Retrieve the device sessions (multi-session account switcher).
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param options - Better Auth params (`fetchOptions`) and React Query
 *   options forwarded to `useQuery`.
 * @returns React Query result for the device sessions list.
 */
export function useListDeviceSessions(options?: UseListDeviceSessionsOptions) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  const { fetchOptions, ...queryOptions } = options ?? {}

  return useQuery({
    ...listDeviceSessionsOptions(authClient, userId, { fetchOptions }),
    ...(disabled && { queryFn: skipToken }),
    ...queryOptions
  })
}
