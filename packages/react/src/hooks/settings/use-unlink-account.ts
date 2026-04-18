import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { unlinkAccountOptions } from "../../mutations/settings/unlink-account-options"
import { useListAccounts } from "./use-list-accounts"

export type UseUnlinkAccountParams = NonNullable<
  Parameters<AuthClient["unlinkAccount"]>[0]
>

export type UseUnlinkAccountOptions = Omit<
  ReturnType<typeof unlinkAccountOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for unlinking a social provider from the current user.
 *
 * Refetches the linked accounts list on success.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useUnlinkAccount(options?: UseUnlinkAccountOptions) {
  const { authClient } = useAuth()
  const { refetch } = useListAccounts({ refetchOnMount: false })

  return useMutation({
    ...unlinkAccountOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
