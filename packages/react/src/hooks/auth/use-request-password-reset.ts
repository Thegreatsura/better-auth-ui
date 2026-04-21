import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type RequestPasswordResetOptions,
  requestPasswordResetOptions
} from "../../mutations/auth/request-password-reset-options"

/**
 * Hook that creates a mutation for the forgot-password flow.
 *
 * Sends a password reset email for the provided address.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useRequestPasswordReset<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: RequestPasswordResetOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...requestPasswordResetOptions(authClient)
  })
}
