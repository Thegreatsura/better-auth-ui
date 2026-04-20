import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import {
  type SignInPasskeyOptions,
  signInPasskeyOptions
} from "../../mutations/passkey/sign-in-passkey-options"
import { sessionOptions } from "../../queries/auth/session-options"

/**
 * Hook that creates a mutation for passkey sign-in.
 *
 * Resets the session query on completion so the new session is refetched.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInPasskey<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options?: SignInPasskeyOptions<TAuthClient>
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    ...signInPasskeyOptions(authClient),
    onSuccess: async (...args) => {
      queryClient.resetQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(...args)
    }
  })
}
