import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

export type LinkSocialParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["linkSocial"]
>[0]

type LinkSocialOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof linkSocialOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for linking a social provider to the current user.
 *
 * @param authClient - The Better Auth client.
 */
export function linkSocialOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "linkSocial"]

  const mutationFn = (params: LinkSocialParams<TAuthClient>) =>
    authClient.linkSocial({
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
 * Hook that creates a mutation for linking a social provider to the current user.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useLinkSocial<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: LinkSocialOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...linkSocialOptions(authClient)
  })
}
