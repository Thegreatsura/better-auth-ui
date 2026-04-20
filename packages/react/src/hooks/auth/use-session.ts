import { useQuery } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type SessionOptions,
  type SessionParams,
  sessionOptions
} from "../../queries/auth/session-options"

export type UseSessionOptions<TAuthClient extends AuthClient> =
  SessionOptions<TAuthClient> & SessionParams<TAuthClient>

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
