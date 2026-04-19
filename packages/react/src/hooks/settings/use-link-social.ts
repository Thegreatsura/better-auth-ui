import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { linkSocialOptions } from "../../mutations/settings/link-social-options"

export type UseLinkSocialParams = NonNullable<
  Parameters<AuthClient["linkSocial"]>[0]
>

export type UseLinkSocialOptions = Omit<
  ReturnType<typeof linkSocialOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for linking a social provider to the current user.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useLinkSocial(options?: UseLinkSocialOptions) {
  const { authClient } = useAuth()

  return useMutation({
    ...linkSocialOptions(authClient),
    ...options
  })
}
