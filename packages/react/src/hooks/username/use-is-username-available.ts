import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { isUsernameAvailableOptions } from "../../mutations/username/is-username-available-options"

export type UseIsUsernameAvailableParams = NonNullable<
  Parameters<AuthClient["isUsernameAvailable"]>[0]
>

export type UseIsUsernameAvailableOptions = Omit<
  ReturnType<typeof isUsernameAvailableOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation to check if a username is available.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result where data contains `{ available: boolean }`.
 */
export function useIsUsernameAvailable(
  options?: UseIsUsernameAvailableOptions
) {
  const { authClient } = useAuth()

  return useMutation({
    ...isUsernameAvailableOptions(authClient),
    ...options
  })
}
