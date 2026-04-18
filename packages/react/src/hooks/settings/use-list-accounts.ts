import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listAccountsOptions } from "../../queries/settings/list-accounts-options"
import { useSession } from "../auth/use-session"

export type UseListAccountsOptions = Omit<
  ReturnType<typeof listAccountsOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve the current user's linked social accounts.
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param params - Parameters forwarded to `authClient.listAccounts`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the user's linked accounts.
 */
export function useListAccounts(
  params?: Parameters<AuthClient["listAccounts"]>[0],
  options?: UseListAccountsOptions
) {
  const { authClient } = useAuth()
  const { data: session } = useSession(undefined, { refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  return useQuery({
    ...listAccountsOptions(authClient, userId, params),
    ...(disabled && { queryFn: skipToken }),
    ...options
  })
}
