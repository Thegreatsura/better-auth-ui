import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { resetPasswordOptions } from "../../mutations/auth/reset-password-options"

export type UseResetPasswordParams = NonNullable<
  Parameters<AuthClient["resetPassword"]>[0]
>

export type UseResetPasswordOptions = Omit<
  ReturnType<typeof resetPasswordOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for the reset-password flow.
 *
 * Resets the user's password using the provided token and new password.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useResetPassword(options?: UseResetPasswordOptions) {
  const { authClient } = useAuth()

  return useMutation({
    ...resetPasswordOptions(authClient),
    ...options
  })
}
