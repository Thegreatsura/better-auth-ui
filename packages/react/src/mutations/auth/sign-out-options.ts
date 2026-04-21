import { mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type SignOutParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["signOut"]
>[0]

export type SignOutOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof signOutOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for signing out.
 *
 * @param authClient - The Better Auth client.
 */
export function signOutOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "signOut"]

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: SignOutParams<TAuthClient> | void) =>
    authClient.signOut({
      ...(params ?? {}),
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
