import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { type UseAuthQueryOptions, useAuthQuery } from "../auth/use-auth-query"
import { useSession } from "../auth/use-session"

/**
 * Retrieve the current user's linked social accounts.
 *
 * The query runs only when at least one social provider is configured and a session exists.
 * The provided `options` are forwarded to both `useSession` and `useQuery`, allowing customization of initial data and query behavior.
 *
 * @param options - Optional react-query / initial-data options forwarded to `useSession` and `useQuery`
 * @returns The react-query result containing linked accounts data, loading state, and error state
 */
export function useListAccounts(
  options?: Partial<UseAuthQueryOptions<AuthClient["listAccounts"]>>
) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })

  return useAuthQuery({
    authFn: authClient.listAccounts,
    options: {
      queryKey: ["auth", "listAccounts", session?.user.id],
      enabled: !!session,
      ...options
    }
  })
}
