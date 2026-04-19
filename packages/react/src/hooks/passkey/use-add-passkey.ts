import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { addPasskeyOptions } from "../../mutations/passkey/add-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

export type UseAddPasskeyParams = NonNullable<
  Parameters<PasskeyAuthClient["passkey"]["addPasskey"]>[0]
>

export type UseAddPasskeyOptions = Omit<
  ReturnType<typeof addPasskeyOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for registering a new passkey.
 *
 * Refetches the user's passkey list on success.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useAddPasskey(options?: UseAddPasskeyOptions) {
  const { authClient } = useAuth<PasskeyAuthClient>()
  const { refetch } = useListUserPasskeys()

  return useMutation({
    ...addPasskeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
