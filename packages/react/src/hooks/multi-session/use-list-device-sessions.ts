import { useQuery } from "@tanstack/react-query"
import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import { listDeviceSessionsOptions } from "../../queries/multi-session/list-device-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListDeviceSessionsParams<
  TAuthClient extends MultiSessionAuthClient
> = NonNullable<
  Parameters<TAuthClient["multiSession"]["listDeviceSessions"]>[0]
>

export type UseListDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
> = Omit<ReturnType<typeof listDeviceSessionsOptions>, "queryKey" | "queryFn"> &
  UseListDeviceSessionsParams<TAuthClient>

/**
 * Retrieve the device sessions (multi-session account switcher).
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param options - `listDeviceSessions` params & `useQuery` options.
 */
export function useListDeviceSessions<
  TAuthClient extends MultiSessionAuthClient
>(
  authClient: TAuthClient,
  options: UseListDeviceSessionsOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const { fetchOptions, ...queryOptions } = options

  return useQuery({
    ...listDeviceSessionsOptions(authClient, session?.user.id, {
      fetchOptions
    }),
    ...queryOptions
  })
}
