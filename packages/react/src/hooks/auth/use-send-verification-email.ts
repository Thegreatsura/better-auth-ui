import { useMutation } from "@tanstack/react-query"

import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-clients/auth-client"
import { sendVerificationEmailOptions } from "../../mutations/auth/send-verification-email-options"

export type UseSendVerificationEmailParams = NonNullable<
  Parameters<AuthClient["sendVerificationEmail"]>[0]
>

export type UseSendVerificationEmailOptions = Omit<
  ReturnType<typeof sendVerificationEmailOptions>,
  "mutationKey" | "mutationFn"
>

/**
 * Hook that creates a mutation to send a verification email.
 *
 * @param options - React Query options forwarded to `useMutation`.
 * @returns The `useMutation` result.
 */
export function useSendVerificationEmail(
  options?: UseSendVerificationEmailOptions
) {
  const { authClient } = useAuth()

  return useMutation({
    ...sendVerificationEmailOptions(authClient),
    ...options
  })
}
