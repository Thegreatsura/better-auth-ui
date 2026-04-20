import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-clients/auth-client"

export type UpdateUserParams<TAuthClient extends AuthClient = AuthClient> =
  Parameters<TAuthClient["updateUser"]>[0]

export type UpdateUserOptions<TAuthClient extends AuthClient = AuthClient> =
  Omit<
    ReturnType<typeof updateUserOptions<TAuthClient>>,
    "mutationKey" | "mutationFn"
  >

/**
 * Mutation options factory for updating the authenticated user's profile.
 *
 * @param authClient - The Better Auth client.
 */
export function updateUserOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationFn = (params: UpdateUserParams<TAuthClient>) =>
    authClient.updateUser({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    UpdateUserParams<TAuthClient>
  >({
    mutationKey: ["auth", "updateUser"],
    mutationFn
  })
}
