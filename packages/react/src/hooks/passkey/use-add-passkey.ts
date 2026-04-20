import { useMutation } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { addPasskeyOptions } from "../../mutations/passkey/add-passkey-options"
import { useListUserPasskeys } from "./use-list-user-passkeys"

export type UseAddPasskeyParams<TAuthClient extends PasskeyAuthClient> =
  NonNullable<Parameters<TAuthClient["passkey"]["addPasskey"]>[0]>

export type UseAddPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof addPasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for registering a new passkey.
 *
 * Refetches the user's passkey list on success.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useAddPasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: UseAddPasskeyOptions<TAuthClient>
) {
  const { refetch } = useListUserPasskeys(authClient)

  return useMutation({
    ...addPasskeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
