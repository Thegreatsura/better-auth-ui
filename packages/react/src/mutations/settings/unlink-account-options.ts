import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-clients/auth-client"

export type UnlinkAccountParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["unlinkAccount"]
>[0]

export type UnlinkAccountOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof unlinkAccountOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for unlinking a social provider from the current user.
 *
 * @param authClient - The Better Auth client.
 */
export function unlinkAccountOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "unlinkAccount"]

  const mutationFn = (params: UnlinkAccountParams<TAuthClient>) =>
    authClient.unlinkAccount({
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
