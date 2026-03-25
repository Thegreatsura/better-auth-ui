import type { AuthClient } from "@better-auth-ui/react"
import type { UseAuthQueryOptions } from "./use-auth-query"

import { useSession } from "./use-session"

/**
 * Retrieve the current authenticated user.
 *
 * @param options - Options to merge into the React Query configuration for the session query.
 * @returns The React Query result with `data` containing the user object from the session.
 */
export function useUser(
  options?: Partial<UseAuthQueryOptions<AuthClient["getSession"]>>
) {
  const { data, ...rest } = useSession(options)

  return {
    data: data?.user,
    ...rest
  }
}
