import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import { useListUserPasskeys } from "../../queries/passkey/list-user-passkeys-query"

export type AddPasskeyParams<TAuthClient extends PasskeyAuthClient> = Parameters<
  TAuthClient["passkey"]["addPasskey"]
>[0]

type AddPasskeyOptions<TAuthClient extends PasskeyAuthClient> = Omit<
  ReturnType<typeof addPasskeyOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for registering a new passkey.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 */
export function addPasskeyOptions<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "passkey", "addPasskey"]

  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (params?: AddPasskeyParams<TAuthClient> | void) =>
    authClient.passkey.addPasskey({
      ...(params ?? {}),
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
