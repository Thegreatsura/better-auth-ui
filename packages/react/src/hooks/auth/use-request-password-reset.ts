import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { requestPasswordResetOptions } from "../../mutations/auth/request-password-reset-options"

export type UseRequestPasswordResetOptions = Omit<
  ReturnType<typeof requestPasswordResetOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for the forgot-password flow.
 *
 * Sends a password reset email for the provided address.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useRequestPasswordReset(
  options?: UseRequestPasswordResetOptions
) {
  const { authClient } = useAuth()

  return useMutation({
    ...requestPasswordResetOptions(authClient),
    ...options
  })
}
