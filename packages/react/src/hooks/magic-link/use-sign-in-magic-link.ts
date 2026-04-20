import { useMutation } from "@tanstack/react-query"

import type { MagicLinkAuthClient } from "../../lib/auth-clients/magic-link-auth-client"
import {
  type SignInMagicLinkOptions,
  signInMagicLinkOptions
} from "../../mutations/magic-link/sign-in-magic-link-options"

/**
 * Hook that creates a mutation for magic-link sign-in.
 *
 * @param authClient - The Better Auth client with the magic-link plugin.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSignInMagicLink<TAuthClient extends MagicLinkAuthClient>(
  authClient: TAuthClient,
  options?: SignInMagicLinkOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...signInMagicLinkOptions(authClient)
  })
}
