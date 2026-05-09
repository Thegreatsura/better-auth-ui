import { apiKeyMutationKeys } from "@better-auth-ui/core/plugins"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { ApiKeyAuthClient } from "../../lib/auth-client"
import { useListApiKeys } from "../../queries/api-key/list-api-keys-query"

export type CreateApiKeyParams<TAuthClient extends ApiKeyAuthClient> =
  Parameters<TAuthClient["apiKey"]["create"]>[0]

export type CreateApiKeyOptions<TAuthClient extends ApiKeyAuthClient> = Omit<
  ReturnType<typeof createApiKeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for creating an API key.
 *
 * @param authClient - The Better Auth client with the API key plugin.
 */
export function createApiKeyOptions<TAuthClient extends ApiKeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = apiKeyMutationKeys.createApiKey

  const mutationFn = (params: CreateApiKeyParams<TAuthClient>) =>
    authClient.apiKey.create({
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
 * Create a mutation for creating an API key.
 *
 * Refetches the user's API key list on success unless disabled via options.
 *
 * @param authClient - The Better Auth client with the API key plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useCreateApiKey<TAuthClient extends ApiKeyAuthClient>(
  authClient: TAuthClient,
  options?: CreateApiKeyOptions<TAuthClient>
) {
  const { refetch } = useListApiKeys(authClient, { refetchOnMount: false })

  return useMutation({
    ...createApiKeyOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
