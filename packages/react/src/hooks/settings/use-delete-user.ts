import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type DeleteUserOptions,
  deleteUserOptions
} from "../../mutations/settings/delete-user-options"

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
