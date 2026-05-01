import { authMutationKeys } from "@better-auth-ui/core"
import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"

export type ChangeEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["changeEmail"]
>[0]

export type ChangeEmailOptions<TAuthClient extends AuthClient> = Omit<
  ReturnType<typeof changeEmailOptions<TAuthClient>>,
  "mutationKey" | "mutationFn"
>

/**
 * Mutation options factory for changing the current user's email address.
 *
 * @param authClient - The Better Auth client.
 */
export function changeEmailOptions<TAuthClient extends AuthClient>(
  authClient: TAuthClient
) {
  const mutationKey = authMutationKeys.changeEmail

  const mutationFn = (params: ChangeEmailParams<TAuthClient>) =>
    authClient.changeEmail({
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
 * Create a mutation for changing the current user's email address.
 *
 * Wraps `authClient.changeEmail`, refetches the session on success to
 * surface the new email, and forwards React Query mutation options such
 * as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useChangeEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ChangeEmailOptions<TAuthClient>
) {
  const { refetch } = useSession(authClient, { refetchOnMount: false })

  return useMutation({
    ...changeEmailOptions(authClient),
    ...options,
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
