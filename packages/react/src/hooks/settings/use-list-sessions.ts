import { skipToken, useQuery } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type ListSessionsOptions,
  type ListSessionsParams,
  listSessionsOptions
} from "../../queries/settings/list-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListSessionsOptions<TAuthClient extends AuthClient> =
  ListSessionsOptions<TAuthClient> & ListSessionsParams<TAuthClient>

/**
 * Retrieve the active sessions (devices where the current user is signed in).
 *
 * @param authClient - The Better Auth client.
 * @param options - `listSessions` params & `useQuery` options.
 */
export function useListSessions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseListSessionsOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listSessionsOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
