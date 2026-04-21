import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { useListAccounts } from "../../queries/settings/list-accounts-query"

type UnlinkAccountParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["unlinkAccount"]
>[0]

type UnlinkAccountOptions<TAuthClient extends AuthClient> = Omit<
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

/**
 * Hook that creates a mutation for unlinking a social provider from the current user.
 *
 * Refetches the linked accounts list on success.
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
    ...options,
    ...unlinkAccountOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
