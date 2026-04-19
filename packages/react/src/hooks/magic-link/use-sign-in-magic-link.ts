import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { MagicLinkAuthClient } from "../../lib/auth-clients/magic-link-auth-client"
import { signInMagicLinkOptions } from "../../mutations/magic-link/sign-in-magic-link-options"

export type UseSignInMagicLinkParams = NonNullable<
  Parameters<MagicLinkAuthClient["signIn"]["magicLink"]>[0]
>

export type UseSignInMagicLinkOptions = Omit<
  ReturnType<typeof signInMagicLinkOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for magic-link sign-in.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInMagicLink(options?: UseSignInMagicLinkOptions) {
  const { authClient } = useAuth<MagicLinkAuthClient>()

  return useMutation({
    ...signInMagicLinkOptions(authClient),
    ...options
  })
}
