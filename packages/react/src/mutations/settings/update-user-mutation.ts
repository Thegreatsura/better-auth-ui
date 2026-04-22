import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { sessionOptions, useSession } from "../../queries/auth/session-query"

export type UpdateUserParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["updateUser"]
>[0]

type UpdateUserOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof updateUserOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for updating the authenticated user's profile.
 *
 * @param authClient - The Better Auth client.
 */
export function updateUserOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = ["auth", "updateUser"]

  const mutationFn = (params: UpdateUserParams<TAuthClient>) =>
    authClient.updateUser({
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
 * Create a mutation for updating the authenticated user's profile.
 *
 * Wraps `authClient.updateUser`, optimistically patches the cached session
 * with the new fields, refetches the session, and forwards React Query
 * mutation options such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useUpdateUser<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: UpdateUserOptions<TAuthClient>
) {
  const { data: session, refetch: refetchSession } = useSession(authClient, {
    refetchOnMount: false
  })

  const queryClient = useQueryClient()

  return useMutation({
    ...updateUserOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      if (session) {
        queryClient.setQueryData(sessionOptions(authClient).queryKey, {
          ...session,
          user: { ...session.user, ...variables }
        })
      }

      refetchSession()

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
