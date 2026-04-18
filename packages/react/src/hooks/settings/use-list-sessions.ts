import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listSessionsOptions } from "../../queries/list-sessions-options"
import { useSession } from "../auth/use-session"

export type UseListSessionsOptions = Omit<
  ReturnType<typeof listSessionsOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve the active sessions (devices where the current user is signed in).
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param params - Parameters forwarded to `authClient.listSessions`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the sessions list.
 */
export function useListSessions(
  params?: Parameters<AuthClient["listSessions"]>[0],
  options?: UseListSessionsOptions
) {
  const { authClient } = useAuth()
  const { data: session } = useSession(undefined, { refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  return useQuery({
    ...listSessionsOptions(authClient, userId, params),
    ...(disabled && { queryFn: skipToken }),
    ...options
  })
}
