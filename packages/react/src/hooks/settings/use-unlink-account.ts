import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type UnlinkAccountOptions,
  unlinkAccountOptions
} from "../../mutations/settings/unlink-account-options"
import { useListAccounts } from "./use-list-accounts"

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
