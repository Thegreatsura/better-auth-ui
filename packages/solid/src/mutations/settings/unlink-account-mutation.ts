import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import type { AuthClient } from "../../lib/auth-client"
import { createAuthMutationOptions } from "../create-auth-mutation"
import { useSessionScopedMutation } from "../use-session-scoped-mutation"

export type UnlinkAccountParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["unlinkAccount"]
>[0]

export type UnlinkAccountOptions = Parameters<
  typeof useSessionScopedMutation<
    AuthClient,
    AuthClient["unlinkAccount"],
    typeof authMutationKeys.unlinkAccount
  >
>[4]

export function unlinkAccountOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  return createAuthMutationOptions(
    authClient.unlinkAccount,
    authMutationKeys.unlinkAccount
  )
}

export function useUnlinkAccount<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UnlinkAccountOptions
) {
  return useSessionScopedMutation(
    authClient,
    authClient.unlinkAccount,
    authMutationKeys.unlinkAccount,
    (userId) => ({ awaits: [authQueryKeys.listAccounts(userId)] }),
    options
  )
}
