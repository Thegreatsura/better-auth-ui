import { skipToken, useQuery } from "@tanstack/react-query"

import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"
import {
  type ListDeviceSessionsOptions,
  type ListDeviceSessionsParams,
  listDeviceSessionsOptions
} from "../../queries/multi-session/list-device-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListDeviceSessionsOptions<
  TAuthClient extends MultiSessionAuthClient
> = ListDeviceSessionsOptions<TAuthClient> &
  ListDeviceSessionsParams<TAuthClient>

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
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listDeviceSessionsOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
