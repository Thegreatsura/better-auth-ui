import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { changeEmailOptions } from "../../mutations/settings/change-email-options"
import { useSession } from "../auth/use-session"

export type UseChangeEmailParams = NonNullable<
  Parameters<AuthClient["changeEmail"]>[0]
>

export type UseChangeEmailOptions = Omit<
  ReturnType<typeof changeEmailOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for changing the current user's email address.
 *
 * Refetches the session on success to surface the new email.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useChangeEmail(options?: UseChangeEmailOptions) {
  const { authClient } = useAuth()
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
