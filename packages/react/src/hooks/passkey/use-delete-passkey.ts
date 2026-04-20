import { useMutation } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import {
  type DeletePasskeyOptions,
  deletePasskeyOptions
} from "../../mutations/passkey/delete-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

/**
 * Hook that creates a mutation for deleting a passkey.
 *
 * Refetches the user's passkey list on success.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useDeletePasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: DeletePasskeyOptions<TAuthClient>
) {
  const { refetch } = useListUserPasskeys(authClient, { refetchOnMount: false })

  return useMutation({
    ...options,
    ...deletePasskeyOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
