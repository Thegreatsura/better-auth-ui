import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { MultiSessionAuthClient } from "../../lib/auth-clients/multi-session-auth-client"

export type SetActiveSessionParams<TAuthClient extends MultiSessionAuthClient> =
  Parameters<TAuthClient["multiSession"]["setActive"]>[0]

export type SetActiveSessionOptions<
  TAuthClient extends MultiSessionAuthClient
> = Omit<
  ReturnType<typeof setActiveSessionOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for switching the active device session.
 *
 * @param authClient - The Better Auth client with the multi-session plugin.
 */
export function setActiveSessionOptions<
  TAuthClient extends MultiSessionAuthClient
>(authClient: TAuthClient) {
  const mutationKey = ["auth", "multiSession", "setActive"]

  const mutationFn = (params: SetActiveSessionParams<TAuthClient>) =>
    authClient.multiSession.setActive({
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
