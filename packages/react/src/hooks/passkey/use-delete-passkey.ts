import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { deletePasskeyOptions } from "../../mutations/passkey/delete-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

export type UseDeletePasskeyParams = NonNullable<
  Parameters<PasskeyAuthClient["passkey"]["deletePasskey"]>[0]
>

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
  const { authClient } = useAuth<PasskeyAuthClient>()
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
