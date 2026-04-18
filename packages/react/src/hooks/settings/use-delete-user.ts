import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { deleteUserOptions } from "../../mutations/settings/delete-user-options"

export type UseDeleteUserOptions = Omit<
  ReturnType<typeof deleteUserOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for deleting the authenticated user account.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useDeleteUser(options?: UseDeleteUserOptions) {
  const { authClient } = useAuth()

  return useMutation({
    ...deleteUserOptions(authClient),
    ...options
  })
}
