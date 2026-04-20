import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-clients/auth-client"

export type ChangeEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["changeEmail"]
>[0]

export type ChangeEmailOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof changeEmailOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for changing the current user's email address.
 *
 * @param authClient - The Better Auth client.
 */
export function changeEmailOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "changeEmail"]

  const mutationFn = (params: ChangeEmailParams<TAuthClient>) =>
    authClient.changeEmail({
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
