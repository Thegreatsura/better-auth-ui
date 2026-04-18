import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../components/auth/auth-provider"
import type { AuthClient } from "../lib/auth-client"
import { authQuery } from "./auth-query"

export function sessionQuery(
  authClient: AuthClient,
  params?: Parameters<AuthClient["getSession"]>[0]
) {
  return authQuery(authClient.getSession, ["auth", "getSession"], params)
}

type SessionQuery = typeof sessionQuery
type SessionQueryOptions = ReturnType<SessionQuery>
type SessionQueryParams = Parameters<SessionQuery>[1]

type UseSessionOptions = Omit<SessionQueryOptions, "queryKey"> & {
  params?: SessionQueryParams
}

export function useSession(options?: UseSessionOptions) {
  const { authClient } = useAuth()
  const { params, ...rest } = options ?? {}

  return useQuery({
    ...sessionQuery(authClient, params),
    ...rest
  })
}
