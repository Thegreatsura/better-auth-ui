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

  /** Key for `organization.getActiveOrganization` for the given user. */
  getActiveOrganization: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) =>
    [
      ...organizationQueryKeys.user(userId),
      "getActiveOrganization",
      query ?? null
    ] as const,

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
   * including dynamic access control when enabled).
   */
  hasPermission: <TKey = undefined>(userId: string | undefined, key?: TKey) =>
    [
      ...organizationQueryKeys.user(userId),
      "hasPermission",
      key ?? null
    ] as const
} as const
