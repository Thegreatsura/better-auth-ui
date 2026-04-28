import { authMutationKeys } from "@better-auth-ui/core"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import { useListPasskeys } from "../../queries/passkey/list-passkeys-query"

export type DeletePasskeyParams<TAuthClient extends PasskeyAuthClient> =
  Parameters<TAuthClient["passkey"]["deletePasskey"]>[0]

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
  const mutationKey = authMutationKeys.passkey.deletePasskey

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
 * Create a mutation for deleting a passkey.
 *
 * Wraps `authClient.passkey.deletePasskey`, refetches the user's passkey
 * list on success, and forwards React Query mutation options such as
 * `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useDeletePasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: DeletePasskeyOptions<TAuthClient>
) {
  const { refetch } = useListPasskeys(authClient, { refetchOnMount: false })

  return useMutation({
    ...deletePasskeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
