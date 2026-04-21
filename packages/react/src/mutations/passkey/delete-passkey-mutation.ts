import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import { useListUserPasskeys } from "../../queries/passkey/list-user-passkeys-query"

type DeletePasskeyParams<TAuthClient extends PasskeyAuthClient> = Parameters<
  TAuthClient["passkey"]["deletePasskey"]
>[0]

type DeletePasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof deletePasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for deleting a passkey.
 *
 * @param authClient - The Better Auth client.
 */
export function deletePasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "passkey", "deletePasskey"]

  const mutationFn = (params: DeletePasskeyParams<TAuthClient>) =>
    authClient.passkey.deletePasskey({
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
