import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { accountInfoOptions } from "../../queries/account-info-options"
import { useSession } from "../auth/use-session"

export type UseAccountInfoOptions = Omit<
  ReturnType<typeof accountInfoOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve provider-specific info for a linked account.
 *
 * Keyed per-user; waits for the active session and `params.query.accountId`
 * before firing.
 *
 * @param params - Parameters forwarded to `authClient.accountInfo`.
 * @param options - React Query options forwarded to `useQuery`.
 */
export function useAccountInfo(
  params?: Parameters<AuthClient["accountInfo"]>[0],
  options?: UseAccountInfoOptions
) {
  const { authClient } = useAuth()
  const { data: session } = useSession(undefined, { refetchOnMount: false })
  const userId = session?.user.id
  const accountId = params?.query?.accountId
  const disabled = !userId || !accountId

  return useQuery({
    ...accountInfoOptions(authClient, userId, params),
    ...(disabled && { queryFn: skipToken }),
    ...options
  })
}
