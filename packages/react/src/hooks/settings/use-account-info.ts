import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { accountInfoOptions } from "../../queries/settings/account-info-options"
import { useSession } from "../auth/use-session"

export type UseAccountInfoParams = NonNullable<
  Parameters<AuthClient["accountInfo"]>[0]
>

export type UseAccountInfoOptions = Omit<
  ReturnType<typeof accountInfoOptions>,
  "queryKey" | "queryFn"
> &
  UseAccountInfoParams

/**
 * Retrieve provider-specific info for a linked account.
 *
 * Keyed per-user; waits for the active session and `options.query.accountId`
 * before firing.
 *
 * @param options - Better Auth params (`query`, `fetchOptions`) and React
 *   Query options forwarded to `useQuery`.
 */
export function useAccountInfo(options?: UseAccountInfoOptions) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options ?? {}
  const accountId = query?.accountId
  const disabled = !userId || !accountId

  return useQuery({
    ...accountInfoOptions(authClient, userId, { query, fetchOptions }),
    ...(disabled && { queryFn: skipToken }),
    ...queryOptions
  })
}
