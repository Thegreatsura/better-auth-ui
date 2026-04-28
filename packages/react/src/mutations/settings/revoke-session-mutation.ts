import { authMutationKeys } from "@better-auth-ui/core"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { useListSessions } from "../../queries/settings/list-sessions-query"

export type RevokeSessionParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["revokeSession"]
>[0]

type RevokeSessionOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof revokeSessionOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for revoking a user session.
 *
 * @param authClient - The Better Auth client.
 */
export function revokeSessionOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = authMutationKeys.revokeSession

  const mutationFn = (params: RevokeSessionParams<TAuthClient>) =>
    authClient.revokeSession({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    Parameters<typeof mutationFn>[0]
  >({
    mutationKey,
    mutationFn
  })
}

/**
 * Create a mutation for revoking a user session.
 *
 * Wraps `authClient.revokeSession`, refetches the sessions list on success,
 * and forwards React Query mutation options such as `onSuccess`, `onError`,
 * and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRevokeSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: RevokeSessionOptions<TAuthClient>
) {
  const { refetch: refetchSessions } = useListSessions(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...revokeSessionOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetchSessions()
      await options?.onSuccess?.(...args)
    }
  })
}
