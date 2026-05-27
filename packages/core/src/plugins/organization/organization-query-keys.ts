import { authQueryKeys } from "../../lib/auth-query-keys"

/** Query key factory for organization queries, scoped per user. */
export const organizationQueryKeys = {
  all: (userId: string | undefined) =>
    [...authQueryKeys.user(userId), "organization"] as const,

  lists: (userId: string | undefined) =>
    [...organizationQueryKeys.all(userId), "list"] as const,

  list: <TQuery = undefined>(userId: string | undefined, query?: TQuery) =>
    [...organizationQueryKeys.lists(userId), query ?? null] as const,

  fullDetails: (userId: string | undefined) =>
    [...organizationQueryKeys.all(userId), "fullDetails"] as const,
  fullDetail: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) => [...organizationQueryKeys.fullDetails(userId), query ?? null] as const,

  activeOrganization: <TQuery = undefined>(
    userId: string | undefined,
    query?: TQuery
  ) => organizationQueryKeys.fullDetail(userId, query),

  members: {
    all: (userId: string | undefined) =>
      [...organizationQueryKeys.all(userId), "members"] as const,
    lists: (userId: string | undefined) =>
      [...organizationQueryKeys.members.all(userId), "list"] as const,
    list: <TQuery = undefined>(userId: string | undefined, query?: TQuery) =>
      [...organizationQueryKeys.members.lists(userId), query ?? null] as const
  },

  invitations: {
    all: (userId: string | undefined) =>
      [...organizationQueryKeys.all(userId), "invitations"] as const,
    lists: (userId: string | undefined) =>
      [...organizationQueryKeys.invitations.all(userId), "list"] as const,
    list: <TQuery = undefined>(userId: string | undefined, query?: TQuery) =>
      [
        ...organizationQueryKeys.invitations.lists(userId),
        query ?? null
      ] as const
  },

  userInvitations: {
    all: (userId: string | undefined) =>
      [...organizationQueryKeys.all(userId), "userInvitations"] as const,
    lists: (userId: string | undefined) =>
      [...organizationQueryKeys.userInvitations.all(userId), "list"] as const,
    list: <TQuery = undefined>(userId: string | undefined, query?: TQuery) =>
      [
        ...organizationQueryKeys.userInvitations.lists(userId),
        query ?? null
      ] as const
  },

  permissions: {
    all: (userId: string | undefined) =>
      [...organizationQueryKeys.all(userId), "permissions"] as const,
    has: <TQuery = undefined>(userId: string | undefined, query?: TQuery) =>
      [
        ...organizationQueryKeys.permissions.all(userId),
        "has",
        query ?? null
      ] as const
  }
} as const
