import { useMutation } from "@tanstack/react-query"

import type { AuthClient } from "../../lib/auth-clients/auth-client"
import {
  type SendVerificationEmailOptions,
  sendVerificationEmailOptions
} from "../../mutations/auth/send-verification-email-options"

/**
 * Hook that creates a mutation to send a verification email.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useSendVerificationEmail<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: SendVerificationEmailOptions<TAuthClient>
) {
  return useMutation({
    ...options,
    ...sendVerificationEmailOptions(authClient)
  })
}
