import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import { changePasswordOptions } from "../../mutations/settings/change-password-options"

export type UseChangePasswordOptions = Omit<
  ReturnType<typeof changePasswordOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for changing the authenticated user's password.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useChangePassword(options?: UseChangePasswordOptions) {
  const { authClient } = useAuth()

  return useMutation({
    ...changePasswordOptions(authClient),
    ...options
  })
}
