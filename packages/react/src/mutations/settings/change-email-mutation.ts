import { mutationOptions, useMutation } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { AuthClient } from "../../lib/auth-client"
import { useSession } from "../../queries/auth/session-query"

type ChangeEmailParams<TAuthClient extends AuthClient> = Parameters<
  TAuthClient["changeEmail"]
>[0]

type ChangeEmailOptions<TAuthClient extends AuthClient> = Omit<
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
  const mutationKey = ["auth", "changeEmail"]

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
 * Hook that creates a mutation for changing the current user's email address.
 *
 * Refetches the session on success to surface the new email.
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
    ...options,
    ...changeEmailOptions(authClient),
    onSuccess: async (...args) => {
      await refetch()
      await options?.onSuccess?.(...args)
    }
  })
}
