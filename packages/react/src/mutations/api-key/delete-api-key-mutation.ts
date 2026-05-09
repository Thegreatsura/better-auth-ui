import { apiKeyMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { ApiKeyAuthClient } from "../../lib/auth-client"
import { useListApiKeys } from "../../queries/api-key/list-api-keys-query"

export type DeleteApiKeyParams<TAuthClient extends ApiKeyAuthClient> =
  Parameters<TAuthClient["apiKey"]["delete"]>[0]

export type DeleteApiKeyOptions<TAuthClient extends ApiKeyAuthClient> = Omit<
  ReturnType<typeof deleteApiKeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for deleting an API key.
 *
 * @param authClient - The Better Auth client with the API key plugin.
 */
export function deleteApiKeyOptions<TAuthClient extends ApiKeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = apiKeyMutationKeys.deleteApiKey

  const mutationFn = (params: DeleteApiKeyParams<TAuthClient>) =>
    authClient.apiKey.delete({
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
 * Create a mutation for deleting an API key.
 *
 * @param authClient - The Better Auth client with the API key plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useDeleteApiKey<TAuthClient extends ApiKeyAuthClient>(
  authClient: TAuthClient,
  options?: DeleteApiKeyOptions<TAuthClient>
) {
  const { refetch } = useListApiKeys(authClient, { refetchOnMount: false })

  return useMutation({
    ...deleteApiKeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
