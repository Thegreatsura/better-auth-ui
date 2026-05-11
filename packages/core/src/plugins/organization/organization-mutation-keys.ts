/**
 * Hierarchical mutation key factory for organization-related mutations.
 *
 * Mutation keys are mostly used for `useIsMutating` and global
 * `MutationCache` observers (e.g. toast handling), so the keys are static
 * tuples rather than parameterised factories. Each grouping exposes an
 * `all` prefix so consumers can match a whole feature at once:
 *
 * ```ts
 * useIsMutating({ mutationKey: organizationMutationKeys.all })
 * ```
 */
export const organizationMutationKeys = {
  /** Root key for every organization mutation. */
  all: ["auth", "organization"] as const,

  /** Key for `organization.create`. */
  createOrganization: ["auth", "organization", "create"] as const,

  /** Key for `organization.delete`. */
  deleteOrganization: ["auth", "organization", "delete"] as const,

  /** Key for `organization.update`. */
  updateOrganization: ["auth", "organization", "update"] as const,

  /** Key for `organization.setActive`. */
  setActiveOrganization: ["auth", "organization", "setActive"] as const,

  /** Key for `organization.inviteMember`. */
  inviteMember: ["auth", "organization", "inviteMember"] as const,

  /** Key for `organization.removeMember`. */
  removeMember: ["auth", "organization", "removeMember"] as const,

  /** Key for `organization.updateMemberRole`. */
  updateMemberRole: ["auth", "organization", "updateMemberRole"] as const,

  /** Key for `organization.removeInvitation`. */
  removeInvitation: ["auth", "organization", "removeInvitation"] as const,

  /** Key for `organization.acceptInvitation`. */
  acceptInvitation: ["auth", "organization", "acceptInvitation"] as const,

  /** Key for `organization.rejectInvitation` (invitee declines). */
  rejectInvitation: ["auth", "organization", "rejectInvitation"] as const
} as const
