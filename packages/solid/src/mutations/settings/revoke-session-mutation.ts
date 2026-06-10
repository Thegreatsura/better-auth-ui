import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import type { AuthClient } from "../../lib/auth-client"
import { createAuthMutationOptions } from "../create-auth-mutation"
import { useSessionScopedMutation } from "../use-session-scoped-mutation"

export type RevokeSessionParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["revokeSession"]
>[0]

export type RevokeSessionOptions = Parameters<
  typeof useSessionScopedMutation<
    AuthClient,
    AuthClient["revokeSession"],
    typeof authMutationKeys.revokeSession
  >
>[4]

export function revokeSessionOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  return createAuthMutationOptions(
    authClient.revokeSession,
    authMutationKeys.revokeSession
  )
}

export function useRevokeSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: RevokeSessionOptions
) {
  return useSessionScopedMutation(
    authClient,
    authClient.revokeSession,
    authMutationKeys.revokeSession,
    (userId) => ({ awaits: [authQueryKeys.listSessions(userId)] }),
    options
  )
}
