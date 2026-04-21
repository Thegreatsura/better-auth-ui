import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { MultiSessionAuthClient } from "../../lib/auth-client"

export type RevokeMultiSessionParams<
  TAuthClient extends MultiSessionAuthClient
> = Parameters<TAuthClient["multiSession"]["revoke"]>[0]

export type RevokeMultiSessionOptions<
  TAuthClient extends MultiSessionAuthClient
> = Omit<
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
  const mutationKey = ["auth", "multiSession", "revoke"]

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
