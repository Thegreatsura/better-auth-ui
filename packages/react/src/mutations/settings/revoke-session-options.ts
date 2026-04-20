import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-clients/auth-client"

export type RevokeSessionParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["revokeSession"]
>[0]

export type RevokeSessionOptions<TAuthClient extends AuthClient> = Omit<
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
  const mutationKey = ["auth", "revokeSession"]

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
