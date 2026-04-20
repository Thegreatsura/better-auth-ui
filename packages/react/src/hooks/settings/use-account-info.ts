import { skipToken, useQuery } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type AccountInfoOptions,
  type AccountInfoParams,
  accountInfoOptions
} from "../../queries/settings/account-info-options"
import { useSession } from "../auth/use-session"

export type UseAccountInfoOptions<TAuthClient extends AuthClient> =
  AccountInfoOptions<TAuthClient> & AccountInfoParams<TAuthClient>

/**
 * Retrieve provider-specific info for a linked account.
 *
 * @param authClient - The Better Auth client.
 * @param options - `accountInfo` params & `useQuery` options.
 */
export function useAccountInfo<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseAccountInfoOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = accountInfoOptions(authClient, userId, {
    query,
    fetchOptions
  })

  const canFetch = Boolean(userId && query?.accountId)

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: canFetch ? baseOptions.queryFn : skipToken
  })
}
