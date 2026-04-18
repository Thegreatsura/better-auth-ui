import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listSessionsOptions } from "../../queries/settings/list-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListSessionsParams = NonNullable<
  Parameters<AuthClient["listSessions"]>[0]
>

export type UseListSessionsOptions = Omit<
  ReturnType<typeof listSessionsOptions>,
  "queryKey" | "queryFn"
> &
  UseListSessionsParams

/**
 * Retrieve the active sessions (devices where the current user is signed in).
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param options - Better Auth params (`fetchOptions`) and React Query
 *   options forwarded to `useQuery`.
 * @returns React Query result for the sessions list.
 */
export function useListSessions(options?: UseListSessionsOptions) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  const { fetchOptions, ...queryOptions } = options ?? {}

  return useQuery({
    ...listSessionsOptions(authClient, userId, { fetchOptions }),
    ...(disabled && { queryFn: skipToken }),
    ...queryOptions
  })
}
