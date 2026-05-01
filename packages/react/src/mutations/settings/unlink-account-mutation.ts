import { authMutationKeys } from "@better-auth-ui/core"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { useListAccounts } from "../../queries/settings/list-accounts-query"

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
  const mutationKey = authMutationKeys.unlinkAccount

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

/**
 * Create a mutation for unlinking a social provider from the current user.
 *
 * Wraps `authClient.unlinkAccount`, refetches the linked accounts list on
 * success, and forwards React Query mutation options such as `onSuccess`,
 * `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useUnlinkAccount<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UnlinkAccountOptions<TAuthClient>
) {
  const { refetch } = useListAccounts(authClient, { refetchOnMount: false })

  return useMutation({
    ...unlinkAccountOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
