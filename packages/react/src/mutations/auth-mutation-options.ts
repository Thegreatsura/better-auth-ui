import {
  type MutationKey,
  mutationOptions,
  type UseMutationOptions
} from "@tanstack/react-query"
import type { BetterFetchError, BetterFetchOption } from "better-auth/client"

/**
 * Write-style Better Auth client method. Variables are a single object that
 * may carry top-level params plus `fetchOptions` (e.g. `signIn.email` takes
 * `{ email, password, rememberMe?, fetchOptions? }`).
 *
 * Read-style endpoints use `AuthQueryFn` / `useAuthQuery` instead.
 */
export type AuthMutationFn = (
  // biome-ignore lint/suspicious/noExplicitAny: variance bridge for arbitrary Better Auth client methods
  variables: any
) => Promise<unknown>

/**
 * Resolved data type returned by an {@link AuthMutationFn}.
 */
export type AuthMutationFnData<TFn extends AuthMutationFn> = Awaited<
  ReturnType<TFn>
>

/**
 * Variables type accepted by `mutate` / `mutateAsync` for a given
 * {@link AuthMutationFn}.
 *
 * If the method's params are entirely optional (e.g. `authClient.signOut`),
 * this resolves to `Variables | void` so `mutate()` is callable without
 * arguments. Otherwise it resolves to the exact required shape so the type
 * checker rejects `mutate()` when the underlying call needs params.
 */
export type AuthMutationFnVariables<TFn extends AuthMutationFn> =
  Parameters<TFn>[0] extends infer P
    ? undefined extends P
      ? // biome-ignore lint/suspicious/noConfusingVoidType: void allows no-arg mutate
        NonNullable<P> | void
      : P
    : never

/**
 * Return type of {@link authMutationOptions}, matching the shape produced by
 * TanStack Query's own `mutationOptions` helper.
 */
export type AuthMutationOptions<
  TFn extends AuthMutationFn,
  TMutationKey extends MutationKey = MutationKey
> = Omit<
  UseMutationOptions<
    AuthMutationFnData<TFn>,
    BetterFetchError,
    AuthMutationFnVariables<TFn>
  >,
  "mutationKey"
> & {
  mutationKey: TMutationKey
}

/**
 * Build `mutationOptions` for a write-style Better Auth endpoint.
 *
 * Injects `throw: true` into `fetchOptions` so the promise rejects with a
 * `BetterFetchError` on failure instead of resolving to `{ data, error }`.
 *
 * @param authFn - Better Auth client method (e.g. `authClient.emailOtp.sendVerificationOtp`).
 * @param mutationKey - Stable key for the mutation (used by `useIsMutating`, `MutationCache`, …).
 */
export function authMutationOptions<
  TFn extends AuthMutationFn,
  const TMutationKey extends MutationKey
>(
  authFn: TFn,
  mutationKey: TMutationKey
): AuthMutationOptions<TFn, TMutationKey> {
  const mutationFn = (variables: AuthMutationFnVariables<TFn>) => {
    const vars = (variables ?? {}) as { fetchOptions?: BetterFetchOption }
    return authFn({
      ...vars,
      fetchOptions: { ...vars.fetchOptions, throw: true }
    }) as Promise<AuthMutationFnData<TFn>>
  }

  return mutationOptions<
    AuthMutationFnData<TFn>,
    BetterFetchError,
    AuthMutationFnVariables<TFn>
  >({
    mutationKey,
    mutationFn
  }) as AuthMutationOptions<TFn, TMutationKey>
}
