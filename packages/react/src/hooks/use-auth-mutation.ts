import { type MutationKey, useMutation } from "@tanstack/react-query"
import { authMutationOptions } from "../mutations/auth-mutation-options"

/**
 * Escape-hatch hook for Better Auth endpoints that don't have a purpose-built
 * mutation hook in this library yet. Thin wrapper over `useMutation` and
 * `authMutationOptions`.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.emailOtp.sendVerificationOtp`).
 * @param mutationKey - Scope for the mutation cache key.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useAuthMutation<
  // biome-ignore lint/suspicious/noExplicitAny: matches authMutationOptions' widened constraint
  TFn extends (...args: any) => any,
  const TMutationKey extends MutationKey
>(
  authFn: TFn,
  mutationKey: TMutationKey,
  options?: Omit<
    ReturnType<typeof authMutationOptions<TFn, TMutationKey>>,
    "mutationKey" | "mutationFn"
  >
) {
  return useMutation({
    ...authMutationOptions(authFn, mutationKey),
    ...options
  })
}
