import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { sessionOptions } from "../../queries/auth/session-options"

export type UseSessionParams = NonNullable<
  Parameters<AuthClient["getSession"]>[0]
>

export type UseSessionOptions = Omit<
  ReturnType<typeof sessionOptions>,
  "queryKey" | "queryFn"
> &
  UseSessionParams

/**
 * Retrieve the current authentication session.
 *
 * @param options - Better Auth params (`query`, `fetchOptions`) and React
 *   Query options forwarded to `useQuery`.
 */
export function useSession(options?: UseSessionOptions) {
  const { authClient } = useAuth()
  const { query, fetchOptions, ...queryOptions } = options ?? {}

  return useQuery({
    ...sessionOptions(authClient, { query, fetchOptions }),
    ...queryOptions
  })
}
