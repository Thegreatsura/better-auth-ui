import { useMutation } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import {
  type AddPasskeyOptions,
  addPasskeyOptions
} from "../../mutations/passkey/add-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

/**
 * Hook that creates a mutation for registering a new passkey.
 *
 * Refetches the user's passkey list on success.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useAddPasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: AddPasskeyOptions<TAuthClient>
) {
  const { refetch } = useListUserPasskeys(authClient, { refetchOnMount: false })

  return useMutation({
    ...options,
    ...addPasskeyOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
