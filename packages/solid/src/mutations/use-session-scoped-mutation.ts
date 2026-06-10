import {
  type CreateMutationOptions,
  createMutation,
  type MutationKey
} from "@tanstack/solid-query"
import type { BetterFetchError } from "better-auth/client"
import type { AuthClient } from "../lib/auth-client"
import { useSession } from "../queries/auth/session-query"
import {
  type AuthMutationMeta,
  createAuthMutationOptions,
  type MutationMethod
} from "./create-auth-mutation"

export type SessionScopedMutationOptions<TMethod extends MutationMethod> = Omit<
  CreateMutationOptions<
    Awaited<ReturnType<TMethod>>,
    BetterFetchError,
    Parameters<TMethod>[0]
  >,
  "mutationKey" | "mutationFn" | "meta"
>

/**
 * Create a mutation whose `meta` is derived from the current session's userId.
 *
 * This mirrors `useOrganizationMutation` for non-org domains: it reads the
 * session reactively and passes the userId to a meta factory function so that
 * `MutationInvalidator` can invalidate the correct scoped query keys.
 */
export function useSessionScopedMutation<
  TAuthClient extends AuthClient,
  TMethod extends MutationMethod,
  const TMutationKey extends MutationKey
>(
  authClient: TAuthClient,
  authFn: TMethod,
  mutationKey: TMutationKey,
  meta: (userId: string | undefined) => AuthMutationMeta,
  options?: SessionScopedMutationOptions<TMethod>
) {
  const session = useSession(authClient)

  return createMutation(() => ({
    ...createAuthMutationOptions(authFn, mutationKey),
    ...options,
    meta: meta(
      (session.data as { user?: { id?: string } } | undefined)?.user?.id
    )
  }))
}
