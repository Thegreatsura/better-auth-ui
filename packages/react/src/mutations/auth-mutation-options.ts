import { type MutationKey, mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

export type AuthMutationFn<TData = unknown, TVariables = unknown> = (
  params: TVariables & { fetchOptions?: BetterFetchOption }
) => Promise<{ data: TData }>

type AuthMutationFnData<TFn> =
  TFn extends AuthMutationFn<infer TData> ? TData : never

// biome-ignore lint/suspicious/noExplicitAny: loose constraint for overloaded/generic signatures
type AuthMutationFnVariables<TFn extends (...args: any) => any> =
  undefined extends Parameters<TFn>[0]
    ? // biome-ignore lint/suspicious/noConfusingVoidType: void lets `mutate()` be called with no arg
      void | NonNullable<Parameters<TFn>[0]>
    : Parameters<TFn>[0]

/**
 * Build `mutationOptions` for a Better Auth endpoint.
 *
 * Wires `throw: true` into `fetchOptions` so the mutation rejects with a
 * `BetterFetchError` on failure instead of resolving with `{ error }`.
 *
 * TData is inferred from the endpoint's non-throw response shape. For
 * required-body endpoints where inference falls back to `never`, pass
 * `TData` explicitly (e.g. `authMutationOptions<_, _, { available: boolean }>`).
 *
 * @param authFn - Better Auth client method (e.g. `authClient.signIn.email`).
 * @param mutationKey - Scope for the mutation cache key.
 */
export function authMutationOptions<
  // biome-ignore lint/suspicious/noExplicitAny: constraint widened so required-body endpoints pass
  TFn extends (...args: any) => any,
  const TMutationKey extends MutationKey,
  TData = AuthMutationFnData<TFn>
>(authFn: TFn, mutationKey: TMutationKey) {
  return mutationOptions<TData, BetterFetchError, AuthMutationFnVariables<TFn>>(
    {
      mutationKey,
      mutationFn: (variables) => {
        const v = variables as { fetchOptions?: BetterFetchOption } | undefined
        return authFn({
          ...v,
          fetchOptions: { ...v?.fetchOptions, throw: true }
        } as Parameters<TFn>[0]) as Promise<TData>
      }
    }
  )
}
