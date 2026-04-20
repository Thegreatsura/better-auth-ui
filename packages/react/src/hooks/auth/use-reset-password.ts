import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type ResetPasswordOptions,
  resetPasswordOptions
} from "../../mutations/auth/reset-password-options"

/**
 * Hook that creates a mutation for the reset-password flow.
 *
 * Resets the user's password using the provided token and new password.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useResetPassword<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ResetPasswordOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...resetPasswordOptions(authClient)
  })
}
