import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { signInSocialOptions } from "../../mutations/auth/sign-in-social-options"

export type UseSignInSocialParams = NonNullable<
  Parameters<AuthClient["signIn"]["social"]>[0]
>

export type UseSignInSocialOptions = Omit<
  ReturnType<typeof signInSocialOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation for social sign-in.
 *
 * The mutation initiates a social sign-in flow with the specified provider.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSignInSocial(options?: UseSignInSocialOptions) {
  const { authClient } = useAuth()

  return useMutation({
    ...signInSocialOptions(authClient),
    ...options
  })
}
