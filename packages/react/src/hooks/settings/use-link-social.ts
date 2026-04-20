import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type LinkSocialOptions,
  linkSocialOptions
} from "../../mutations/settings/link-social-options"

/**
 * Hook that creates a mutation for linking a social provider to the current user.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useLinkSocial<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: LinkSocialOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...linkSocialOptions(authClient)
  })
}
