import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"

type DeleteUserParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["deleteUser"]
>[0]

type DeleteUserOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof deleteUserOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for deleting the authenticated user's account.
 *
 * @param authClient - The Better Auth client.
 */
export function deleteUserOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "deleteUser"]

  const mutationFn = (params: DeleteUserParams<TAuthClient>) =>
    authClient.deleteUser({
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
 * Hook that creates a mutation for deleting the authenticated user account.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useDeleteUser<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: DeleteUserOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...deleteUserOptions(authClient)
  })
}
