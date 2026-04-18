import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listAccountsOptions } from "../../queries/settings/list-accounts-options"
import { useSession } from "../auth/use-session"

export type UseListAccountsParams = NonNullable<
  Parameters<AuthClient["listAccounts"]>[0]
>

export type UseListAccountsOptions = Omit<
  ReturnType<typeof listAccountsOptions>,
  "queryKey" | "queryFn"
> &
  UseListAccountsParams

/**
 * Retrieve the current user's linked social accounts.
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param options - Better Auth params (`fetchOptions`) and React Query
 *   options forwarded to `useQuery`.
 * @returns React Query result for the user's linked accounts.
 */
export function useListAccounts(options?: UseListAccountsOptions) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  const { fetchOptions, ...queryOptions } = options ?? {}

  return useQuery({
    ...listAccountsOptions(authClient, userId, { fetchOptions }),
    ...(disabled && { queryFn: skipToken }),
    ...queryOptions
  })
}
