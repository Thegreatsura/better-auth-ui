import { useQuery } from "@tanstack/react-query"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSessionParams<TAuthClient extends AuthClient> = NonNullable<
  Parameters<TAuthClient["getSession"]>[0]
>

export type UseSessionOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof sessionOptions>,
  "queryKey" | "queryFn"
> &
  UseSessionParams<TAuthClient>

/**
 * Retrieve the current session.
 *
 * @param authClient - The Better Auth client.
 * @param options - `getSession` params & `useQuery` options.
 */
export function useSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options: UseSessionOptions<TAuthClient> = {}
) {
  const { query, fetchOptions, ...queryOptions } = options

  return useQuery({
    ...sessionOptions(authClient, { query, fetchOptions }),
    ...queryOptions
  })
}
