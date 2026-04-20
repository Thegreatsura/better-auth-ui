import {
  type MutationKey,
  mutationOptions,
  type UseMutationOptions
} from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

// biome-ignore lint/suspicious/noExplicitAny: canonical "any async function" top type; concrete TFn is inferred at the call site
export type AuthMutationFn = (...args: any[]) => Promise<unknown>

/**
 * Rebuilds a function's call signature via `infer`. `Parameters<TFn>` and
 * `ReturnType<TFn>` widen to `any` when `TFn` is a generic function whose
 * signature depends on an unresolved type parameter (as with Better Auth's
 * proxied client methods); passing `TFn` through this helper forces TS to
 * resolve the signature structurally instead.
 */
export type CallReturn<TFn> = TFn extends (...args: infer A) => infer R
  ? (...args: A) => R
  : never

export type InferData<TFn extends AuthMutationFn> =
  Awaited<ReturnType<CallReturn<TFn>>> extends { data: infer TData }
    ? TData
    : never

export type InferVariables<TFn extends AuthMutationFn> = NonNullable<
  Parameters<CallReturn<TFn>>[0]
>

export type AuthMutationOptions<TFn extends AuthMutationFn> = Omit<
  UseMutationOptions<InferData<TFn>, BetterFetchError, InferVariables<TFn>>,
  "mutationKey" | "mutationFn"
>

/**
 * Build `mutationOptions` for a Better Auth endpoint. `mutate()` can always
 * be called with no argument (variables type is widened with `void`), so
 * no-input mutations like `signOut` work without ceremony.
 *
 * Pass callbacks via the 3rd `options` arg rather than spreading into
 * `useMutation` — the options param is narrowly typed (no `void | T`
 * union) so IntelliSense completions work on `variables` in
 * `onSuccess`/`onError`.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.signIn.email`).
 * @param mutationKey - Scope for the mutation cache key.
 * @param options - Extra `useMutation` options (`onSuccess`, `onError`, etc.).
 */
export function authMutationOptions<
  TFn extends AuthMutationFn,
  const TMutationKey extends MutationKey
>(authFn: TFn, mutationKey: TMutationKey, options?: AuthMutationOptions<TFn>) {
  return mutationOptions<
    InferData<TFn>,
    BetterFetchError,
    // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
    void | InferVariables<TFn>
  >({
    mutationKey,
    // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
    mutationFn: (variables: void | InferVariables<TFn>) => {
      const vars = (variables ?? {}) as {
        fetchOptions?: BetterFetchOption
      }
      return authFn({
        ...vars,
        fetchOptions: { ...vars.fetchOptions, throw: true }
      }) as Promise<InferData<TFn>>
    },
    ...(options as UseMutationOptions<
      InferData<TFn>,
      BetterFetchError,
      // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
      void | InferVariables<TFn>
    >)
  })
}
