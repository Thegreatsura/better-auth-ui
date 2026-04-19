import { useQuery } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { listSessionsOptions } from "../../queries/settings/list-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListSessionsParams<TAuthClient extends AuthClient> = NonNullable<
  Parameters<TAuthClient["listSessions"]>[0]
>

export type UseListSessionsOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof listSessionsOptions>,
  "queryKey" | "queryFn"
> &
  UseListSessionsParams<TAuthClient>

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
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const { fetchOptions, ...queryOptions } = options

  return useQuery({
    ...listSessionsOptions(authClient, session?.user.id, { fetchOptions }),
    ...queryOptions
  })
}
