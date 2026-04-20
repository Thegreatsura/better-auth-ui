import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type ChangePasswordOptions,
  changePasswordOptions
} from "../../mutations/settings/change-password-options"

/**
 * Hook that creates a mutation for changing the authenticated user's password.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useChangePassword<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: ChangePasswordOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...changePasswordOptions(authClient)
  })
}
