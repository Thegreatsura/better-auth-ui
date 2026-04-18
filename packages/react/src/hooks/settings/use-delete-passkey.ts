import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { deletePasskeyOptions } from "../../mutations/settings/delete-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

export type UseDeletePasskeyOptions = Omit<
  ReturnType<typeof deletePasskeyOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for deleting a passkey.
 *
 * Refetches the user's passkey list on success.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useDeletePasskey(options?: UseDeletePasskeyOptions) {
  const { authClient } = useAuth()
  const { refetch } = useListUserPasskeys()

  return useMutation({
    ...deletePasskeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
