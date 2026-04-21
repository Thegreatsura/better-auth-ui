import { skipToken, useQuery } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type ListAccountsOptions,
  type ListAccountsParams,
  listAccountsOptions
} from "../../queries/settings/list-accounts-options"
import { useSession } from "../auth/use-session"

export type UseListAccountsOptions<TAuthClient extends AuthClient> =
  ListAccountsOptions<TAuthClient> & ListAccountsParams<TAuthClient>

/**
 * Retrieve the current user's linked social accounts.
 *
 * @param authClient - The Better Auth client.
 * @param options - `listAccounts` params & `useQuery` options.
 */
export function useListAccounts<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseListAccountsOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listAccountsOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
