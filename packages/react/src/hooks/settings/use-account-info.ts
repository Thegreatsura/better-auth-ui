import { useQuery } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { accountInfoOptions } from "../../queries/settings/account-info-options"
import { useSession } from "../auth/use-session"

export type UseAccountInfoParams<TAuthClient extends AuthClient> = NonNullable<
  Parameters<TAuthClient["accountInfo"]>[0]
>

export type UseAccountInfoOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof accountInfoOptions>,
  "queryKey" | "queryFn"
> &
  UseAccountInfoParams<TAuthClient>

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
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const { query, fetchOptions, ...queryOptions } = options

  return useQuery({
    ...accountInfoOptions(authClient, session?.user.id, {
      query,
      fetchOptions
    }),
    ...queryOptions
  })
}
