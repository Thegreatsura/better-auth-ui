import { authMutationKeys } from "@better-auth-ui/core"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { MultiSessionAuthClient } from "../../lib/auth-client"
import { useListDeviceSessions } from "../../queries/multi-session/list-device-sessions-query"

export type RevokeMultiSessionParams<
  TAuthClient extends MultiSessionAuthClient
> = Parameters<TAuthClient["multiSession"]["revoke"]>[0]

type RevokeMultiSessionOptions<TAuthClient extends MultiSessionAuthClient> =
  Omit<
    ReturnType<typeof revokeMultiSessionOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

/**
 * Mutation options factory for revoking a device session in multi-session mode.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 */
export function revokeMultiSessionOptions<
  TAuthClient extends MultiSessionAuthClient
>(authClient: TAuthClient) {
  const mutationKey = authMutationKeys.multiSession.revoke

  const mutationFn = (params: RevokeMultiSessionParams<TAuthClient>) =>
    authClient.multiSession.revoke({
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
 * Create a mutation for revoking a device session in multi-session mode.
 *
 * Wraps `authClient.multiSession.revoke`, refetches the device sessions list
 * on success, and forwards React Query mutation options such as `onSuccess`,
 * `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRevokeMultiSession<
  TAuthClient extends MultiSessionAuthClient
>(authClient: TAuthClient, options?: RevokeMultiSessionOptions<TAuthClient>) {
  const { refetch } = useListDeviceSessions(authClient, {
    refetchOnMount: false
  })

  return useMutation({
    ...revokeMultiSessionOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
