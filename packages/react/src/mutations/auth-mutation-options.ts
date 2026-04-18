import { type MutationKey, mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

export type AuthMutationFn<TData = unknown, TVariables = unknown> = (
  params: TVariables & { fetchOptions?: BetterFetchOption }
) => Promise<{ data: TData }>

type AuthMutationFnData<TFn> =
  TFn extends AuthMutationFn<infer TData> ? TData : never

type AuthMutationFnVariables<TFn> =
  TFn extends AuthMutationFn<
    // biome-ignore lint/suspicious/noExplicitAny: ignoring TData for variable inference
    any,
    infer TVariables
  >
    ? TVariables
    : never

/**
 * Build `mutationOptions` for a Better Auth endpoint.
 *
 * Wires `throw: true` into `fetchOptions` so the mutation rejects with a
 * `BetterFetchError` on failure instead of resolving with `{ error }`.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.signIn.email`).
 * @param mutationKey - Scope for the mutation cache key.
 */
export function authMutationOptions<
  // biome-ignore lint/suspicious/noExplicitAny: constraint widened so required-body endpoints pass
  TFn extends (...args: any) => any,
  const TMutationKey extends MutationKey
>(authFn: TFn, mutationKey: TMutationKey) {
  return mutationOptions<
    AuthMutationFnData<TFn>,
    BetterFetchError,
    AuthMutationFnVariables<TFn>
  >({
    mutationKey,
    mutationFn: (variables) => {
      const v = variables as { fetchOptions?: BetterFetchOption } | undefined
      return authFn({
        ...v,
        fetchOptions: { ...v?.fetchOptions, throw: true }
      } as Parameters<TFn>[0]) as Promise<AuthMutationFnData<TFn>>
    }
  })
}
