import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions } from "../../queries/session-options"

export type UseSessionOptions = Omit<
  ReturnType<typeof sessionOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve the current authentication session.
 *
 * @param params - Parameters forwarded to `authClient.getSession`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the session.
 */
export function useSession(
  params?: Parameters<AuthClient["getSession"]>[0],
  options?: UseSessionOptions
) {
  const { authClient } = useAuth()

  return useQuery({
    ...sessionOptions(authClient, params),
    ...options
  })
}
