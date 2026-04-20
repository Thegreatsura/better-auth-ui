import {
  type MutationKey,
  mutationOptions,
  type UseMutationOptions,
  useMutation
} from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/react"

/**
 * Canonical "any async function" top type; concrete `TFn` is inferred at the
 * call site.
 */
// biome-ignore lint/suspicious/noExplicitAny: required for generic Better Auth client methods
type AuthMutationFn = (...args: any[]) => Promise<unknown>

type CallReturn<TFn> = TFn extends (...args: infer A) => infer R
  ? (...args: A) => R
  : never

type InferVariables<TFn extends AuthMutationFn> = NonNullable<
  Parameters<CallReturn<TFn>>[0]
>

function buildAuthMutationOptions<
  TFn extends AuthMutationFn,
  const TMutationKey extends MutationKey
>(authFn: TFn, mutationKey: TMutationKey) {
  // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
  const mutationFn = (variables: void | InferVariables<TFn>) => {
    const vars = (variables ?? {}) as {
      fetchOptions?: BetterFetchOption
    }
    return authFn({
      ...vars,
      fetchOptions: { ...vars.fetchOptions, throw: true }
    })
  }

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
    void | InferVariables<TFn>
  >({
    mutationKey,
    mutationFn
  })
}

/**
 * Escape-hatch hook for Better Auth endpoints that don't have a purpose-built
 * mutation hook in this library yet. Thin wrapper over `useMutation` and the
 * same `mutationOptions` shape as the built-in mutation factories.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.emailOtp.sendVerificationOtp`).
 * @param mutationKey - Scope for the mutation cache key.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useAuthMutation<
  TFn extends AuthMutationFn,
  const TMutationKey extends MutationKey
>(
  authFn: TFn,
  mutationKey: TMutationKey,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<CallReturn<TFn>>>,
      BetterFetchError,
      // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
      void | InferVariables<TFn>
    >,
    "mutationKey" | "mutationFn"
  >
) {
  return useMutation({
    ...buildAuthMutationOptions(authFn, mutationKey),
    ...options
  } as UseMutationOptions<
    Awaited<ReturnType<CallReturn<TFn>>>,
    BetterFetchError,
    // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
    void | InferVariables<TFn>
  >)
}
