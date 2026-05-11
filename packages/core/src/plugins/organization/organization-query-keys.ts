import { authQueryKeys } from "../../lib/auth-query-keys"

/**
 * Hierarchical query key factory for organization-related queries.
 *
 * Keys are nested under `["auth", "user", userId, "organization"]` so they
 * can be invalidated in bulk per-user:
 *
 * ```ts
 * queryClient.invalidateQueries({ queryKey: authQueryKeys.user(userId) })
 * ```
 */
export const organizationQueryKeys = {
  /** Prefix for every organization query scoped to a specific user. */
  user: (userId: string | undefined) =>
    [...authQueryKeys.user(userId), "organization"] as const,

  /** Key for `organization.listOrganizations` for the given user. */
  listOrganizations: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "listOrganizations",
      query ?? null
    ] as const,

  /** Key for `organization.getFullOrganization` for the given user. */
  fullOrganization: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "getFullOrganization",
      query ?? null
    ] as const,

  /**
   * Key for the active organization query — i.e. `getFullOrganization` with
   * no `query` argument. Shares a cache entry with
   * `fullOrganization(userId)`.
   */
  activeOrganization: (userId: string | undefined) =>
    organizationQueryKeys.fullOrganization(userId),

  /** Key for `organization.listMembers`. The `organizationId` is part of `query`. */
  listMembers: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "listMembers",
      query ?? null
    ] as const,

  /** Key for `organization.listInvitations`. The `organizationId` is part of `query`. */
  listInvitations: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "listInvitations",
      query ?? null
    ] as const,

  /** Key for `organization.listUserInvitations` (invitations for the current user). */
  listUserInvitations: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "listUserInvitations",
      query ?? null
    ] as const,

  /**
   * Key for `organization.hasPermission` (server evaluates the member's role,
   * including dynamic access control when enabled). `hasPermission` is the
   * only org client method without a nested `query` field — its params are
   * flat — so `query` here is the params object minus `fetchOptions`.
   */
  hasPermission: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "hasPermission",
      query ?? null
    ] as const
} as const
