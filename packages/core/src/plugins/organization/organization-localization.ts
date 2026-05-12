export const organizationLocalization = {
  /** @remarks `"Accept"` */
  acceptInvitation: "Accept",
  /** @remarks `"Actions"` */
  actions: "Actions",
  /** @remarks `"Admin"` */
  admin: "Admin",
  /** @remarks `"Cancel"` */
  cancel: "Cancel",
  /** @remarks `"Change logo"` */
  changeLogo: "Change logo",
  /** @remarks `"Change role"` */
  changeMemberRole: "Change role",
  /** @remarks `"Confirm"` */
  confirm: "Confirm",
  /** @remarks `"Create"` */
  create: "Create",
  /** @remarks `"Create organization"` */
  createOrganization: "Create organization",
  /** @remarks `"Delete"` */
  delete: "Delete",
  /** @remarks `"Delete logo"` */
  deleteLogo: "Delete logo",
  /** @remarks `"Delete organization"` */
  deleteOrganization: "Delete organization",
  /** @remarks `"Are you sure you want to permanently delete this organization? All members will lose access and this cannot be undone."` */
  deleteOrganizationWarning:
    "Are you sure you want to permanently delete this organization? All members will lose access and this cannot be undone.",
  /** @remarks `"Email"` */
  email: "Email",
  /** @remarks `"Invitation removed"` */
  invitationRemoved: "Invitation removed",
  /** @remarks `"Invitations"` */
  invitations: "Invitations",
  /** @remarks `"Invitation sent"` */
  invitationSent: "Invitation sent",
  /** @remarks `"Accepted"` */
  invitationStatusAccepted: "Accepted",
  /** @remarks `"Canceled"` */
  invitationStatusCanceled: "Canceled",
  /** @remarks `"Status"` */
  invitationStatusColumn: "Status",
  /** @remarks `"Pending"` */
  invitationStatusPending: "Pending",
  /** @remarks `"Rejected"` */
  invitationStatusRejected: "Rejected",
  /** @remarks `"Unknown"` */
  invitationStatusUnknown: "Unknown",
  /** @remarks `"Invite"` */
  invite: "Invite",
  /** @remarks `"Invited"` */
  invitedAt: "Invited",
  /** @remarks `"Enter email address"` */
  inviteEmail: "Enter email address",
  /** @remarks `"Invite member"` */
  inviteMember: "Invite member",
  /** @remarks `"We'll email them a link to join this organization. Choose the role they'll have once they accept."` */
  inviteMemberDescription:
    "We'll email them a link to join this organization. Choose the role they'll have once they accept.",
  /** @remarks `"Leave"` */
  leave: "Leave",
  /** @remarks `"Are you sure you want to leave this organization?"` */
  leaveConfirmation: "Are you sure you want to leave this organization?",
  /** @remarks `"Leave organization"` */
  leaveOrganization: "Leave organization",
  /** @remarks `"Logo"` */
  logo: "Logo",
  /** @remarks `"Logo updated successfully"` */
  logoChangedSuccess: "Logo updated successfully",
  /** @remarks `"Logo removed successfully"` */
  logoDeletedSuccess: "Logo removed successfully",
  /** @remarks `"Manage"` */
  manageOrganization: "Manage",
  /** @remarks `"Member"` */
  member: "Member",
  /** @remarks `"Member removed"` */
  memberRemoved: "Member removed",
  /** @remarks `"Member role updated"` */
  memberRoleUpdated: "Member role updated",
  /** @remarks `"Members"` */
  members: "Members",
  /** @remarks `"Name"` */
  name: "Name",
  /** @remarks `"Enter the organization name"` */
  namePlaceholder: "Enter the organization name",
  /** @remarks `"You haven't created any organizations yet."` */
  noActiveOrganization: "You haven't created any organizations yet.",
  /** @remarks `"No invitations"` */
  noInvitations: "No invitations",
  /** @remarks `"No invitations yet"` */
  noOrganizationInvitations: "No invitations yet",
  /** @remarks `"No organizations"` */
  noOrganizations: "No organizations",
  /** @remarks `"Organization"` */
  organization: "Organization",
  /** @remarks `"Organization created"` */
  organizationCreated: "Organization created",
  /** @remarks `"Organization deleted"` */
  organizationDeleted: "Organization deleted",
  /** @remarks `"Invite a teammate to collaborate in this organization."` */
  organizationInvitationsEmptyDescription:
    "Invite a teammate to collaborate in this organization.",
  /** @remarks `"You left the organization"` */
  organizationLeft: "You left the organization",
  /** @remarks `"Profile"` */
  organizationProfile: "Profile",
  /** @remarks `"Organizations"` */
  organizations: "Organizations",
  /** @remarks `"Create an organization to collaborate with others and manage shared access."` */
  organizationsDescription:
    "Create an organization to collaborate with others and manage shared access.",
  /** @remarks `"Organization settings"` */
  organizationSettings: "Organization settings",
  /** @remarks `"Organization updated successfully"` */
  organizationUpdatedSuccess: "Organization updated successfully",
  /** @remarks `"Owner"` */
  owner: "Owner",
  /** @remarks `"Pending invitations"` */
  pendingInvitations: "Pending invitations",
  /** @remarks `"Personal account"` */
  personalAccount: "Personal account",
  /** @remarks `"Reject invitation"` */
  rejectInvitation: "Reject invitation",
  /** @remarks `"Remove invitation"` */
  removeInvitation: "Remove invitation",
  /** @remarks `"Are you sure you want to remove this invitation?"` */
  removeInvitationConfirmation:
    "Are you sure you want to remove this invitation?",
  /** @remarks `"Remove member"` */
  removeMember: "Remove member",
  /** @remarks `"Role"` */
  role: "Role",
  /** @remarks `"Slug"` */
  slug: "Slug",
  /** @remarks `"organization-slug"` */
  slugPlaceholder: "organization-slug",
  /** @remarks `"Switch organization"` */
  switchOrganization: "Switch organization",
  /** @remarks `"Upload logo"` */
  uploadLogo: "Upload logo",
  /** @remarks `"Invitations to join an organization will show up here."` */
  userInvitationsEmptyDescription:
    "Invitations to join an organization will show up here."
} as const

export type OrganizationLocalization = typeof organizationLocalization
