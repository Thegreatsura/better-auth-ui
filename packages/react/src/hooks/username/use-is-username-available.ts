import { useMutation } from "@tanstack/react-query"

import type { UsernameAuthClient } from "../../lib/auth-clients/username-auth-client"
import {
  type IsUsernameAvailableOptions,
  isUsernameAvailableOptions
} from "../../mutations/username/is-username-available-options"

/**
 * Hook that creates a mutation to check if a username is available.
 *
 * @param authClient - The Better Auth client with the username plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useIsUsernameAvailable<TAuthClient extends UsernameAuthClient>(
  authClient: TAuthClient,
  options?: IsUsernameAvailableOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...isUsernameAvailableOptions(authClient)
  })
}
