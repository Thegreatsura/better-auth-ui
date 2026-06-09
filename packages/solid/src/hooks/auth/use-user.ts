import type { AuthClient } from "../../lib/auth-client"
import {
  type UseSessionOptions,
  useSession
} from "../../queries/auth/session-query"

export function useUser<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UseSessionOptions<TAuthClient>
) {
  const { data, ...rest } = useSession(authClient, options)

  return {
    data: data?.user,
    ...rest
  }
}
