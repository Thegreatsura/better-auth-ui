import { type AuthClient, useAuth, useSession } from "@better-auth-ui/react"
import { type UseAuthQueryOptions, useAuthQuery } from "../auth/use-auth-query"

/**
 * Retrieve the passkeys registered for the current user.
 *
 * The underlying query is enabled only when session data is available.
 *
 * @param options - Optional React Query options to customize the query behavior.
 * @returns The React Query result for the passkeys list.
 */
export function useListUserPasskeys(
  options?: Partial<
    UseAuthQueryOptions<AuthClient["passkey"]["listUserPasskeys"]>
  >
) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })

  return useAuthQuery({
    authFn: authClient.passkey.listUserPasskeys,
    options: {
      queryKey: ["auth", "listUserPasskeys", session?.user.id],
      enabled: !!session,
      ...options
    }
  })
}
