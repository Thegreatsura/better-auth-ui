import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-client"
import {
  type SignInSocialOptions,
  signInSocialOptions
} from "../../mutations/auth/sign-in-social-options"

/**
 * Hook that creates a mutation for social sign-in.
 *
 * The mutation initiates a social sign-in flow with the specified provider.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInSocial<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SignInSocialOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...signInSocialOptions(authClient)
  })
}
