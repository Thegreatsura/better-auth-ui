import { useQuery } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { listAccountsOptions } from "../../queries/settings/list-accounts-options"
import { useSession } from "../auth/use-session"

export type UseListAccountsParams<TAuthClient extends AuthClient> = NonNullable<
  Parameters<TAuthClient["listAccounts"]>[0]
>

export type UseListAccountsOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof listAccountsOptions>,
  "queryKey" | "queryFn"
> &
  UseListAccountsParams<TAuthClient>

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
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const { fetchOptions, ...queryOptions } = options

  return useQuery({
    ...listAccountsOptions(authClient, session?.user.id, { fetchOptions }),
    ...queryOptions
  })
}
