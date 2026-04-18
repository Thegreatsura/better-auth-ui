import { type MutationKey, mutationOptions } from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

// biome-ignore lint/suspicious/noExplicitAny: canonical "any async function" top type; concrete TFn is inferred at the call site
export type AuthMutationFn = (...args: any[]) => Promise<unknown>

type InferData<TFn extends AuthMutationFn> =
  Awaited<ReturnType<TFn>> extends { data: infer TData } ? TData : never

type InferVariables<TFn extends AuthMutationFn> =
  undefined extends Parameters<TFn>[0]
    ? // biome-ignore lint/suspicious/noConfusingVoidType: void lets `mutate()` be called with no arg
      void | NonNullable<Parameters<TFn>[0]>
    : Parameters<TFn>[0]

/**
 * Build `mutationOptions` for a Better Auth endpoint.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.signIn.email`).
 * @param mutationKey - Scope for the mutation cache key.
 */
export function authMutationOptions<
  TFn extends AuthMutationFn,
  const TMutationKey extends MutationKey,
  TData = InferData<TFn>
>(authFn: TFn, mutationKey: TMutationKey) {
  return mutationOptions<TData, BetterFetchError, InferVariables<TFn>>({
    mutationKey,
    mutationFn: (variables) => {
      const vars = (variables ?? {}) as {
        fetchOptions?: BetterFetchOption
      }
      return authFn({
        ...vars,
        fetchOptions: { ...vars.fetchOptions, throw: true }
      }) as Promise<TData>
    }
  })
}
