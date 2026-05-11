export const organizationLocalization = {
  /** @remarks `"Organization"` */
  organization: "Organization",
  /** @remarks `"Organizations"` */
  organizations: "Organizations",
  /** @remarks `"Personal account"` — context with no active organization */
  personalAccount: "Personal account",
  /** @remarks `"Create organization"` */
  createOrganization: "Create organization",
  /** @remarks `"Name"` */
  name: "Name",
  /** @remarks `"Name placeholder"` */
  namePlaceholder: "Acme Inc",
  /** @remarks `"Slug"` */
  slug: "Slug",
  /** @remarks `"Slug placeholder"` */
  slugPlaceholder: "my-org",
  /** @remarks `"Create"` */
  create: "Create",
  /** @remarks `"Cancel"` */
  cancel: "Cancel",
  /** @remarks `"Confirm"` */
  confirm: "Confirm",
  /** @remarks `"Delete"` */
  delete: "Delete",
  /** @remarks `"Delete organization"` */
  deleteOrganization: "Delete organization",
  /** @remarks Warning shown before permanently deleting an organization */
  deleteOrganizationWarning:
    "Are you sure you want to permanently delete this organization? All members will lose access and this cannot be undone.",
  /** @remarks `"Leave"` */
  leave: "Leave",
  /** @remarks `"Leave organization"` */
  leaveOrganization: "Leave organization",
  /** @remarks `"Are you sure you want to leave"` */
  leaveConfirmation: "Are you sure you want to leave this organization?",
  /** @remarks `"Members"` */
  members: "Members",
  /** @remarks `"Invite member"` */
  inviteMember: "Invite member",
  /** @remarks Short helper under the invite dialog title */
  inviteMemberDescription:
    "We'll email them a link to join this organization. Choose the role they'll have once they accept.",
  /** @remarks `"Invite member placeholder"` */
  inviteEmail: "Enter email address",
  /** @remarks `"Email"` */
  email: "Email",
  /** @remarks `"Role"` */
  role: "Role",
  /** @remarks `"Status"` — invitation lifecycle in org invitation table */
  invitationStatusColumn: "Status",
  /** @remarks `"Pending"` */
  invitationStatusPending: "Pending",
  /** @remarks `"Accepted"` */
  invitationStatusAccepted: "Accepted",
  /** @remarks `"Rejected"` */
  invitationStatusRejected: "Rejected",
  /** @remarks `"Canceled"` */
  invitationStatusCanceled: "Canceled",
  /** @remarks `"Unknown"` — unrecognized invitation status */
  invitationStatusUnknown: "Unknown",
  /** @remarks `"Actions"` — table column for row controls */
  actions: "Actions",
  /** @remarks `"Change role"` — control to edit a member’s organization role */
  changeMemberRole: "Change role",
  /** @remarks `"Owner"` */
  owner: "Owner",
  /** @remarks `"Admin"` */
  admin: "Admin",
  /** @remarks `"Member"` */
  member: "Member",
  /** @remarks `"Invite"` */
  invite: "Invite",
  /** @remarks `"Invitations"` */
  invitations: "Invitations",
  /** @remarks `"Pending invitations"` */
  pendingInvitations: "Pending invitations",
  /** @remarks `"Remove invitation"` */
  removeInvitation: "Remove invitation",
  /** @remarks `"Are you sure you want to remove this invitation"` */
  removeInvitationConfirmation:
    "Are you sure you want to remove this invitation?",
  /** @remarks `"Organization settings"` */
  organizationSettings: "Organization settings",
  /** @remarks `"Profile"` — heading above the org name / slug form */
  organizationProfile: "Profile",
  /** @remarks Toast after saving organization name or slug */
  organizationUpdatedSuccess: "Organization updated successfully",
  /** @remarks `"Manage"` — primary action on an organization list row */
  manageOrganization: "Manage",
  /** @remarks `"Switch organization"` */
  switchOrganization: "Switch organization",
  /** @remarks `"No organizations"` */
  noOrganizations: "No organizations",
  /** @remarks Empty-state helper under the organizations list title */
  organizationsDescription:
    "Create an organization to collaborate with others and manage shared access.",
  /** @remarks Shown in organization settings when there is no active organization */
  noActiveOrganization: "You haven't created any organizations yet.",
  /** @remarks `"No members yet"` */
  noMembers: "No members yet",
  /** @remarks `"No invitations yet"` */
  noInvitations: "No invitations yet",
  /** @remarks `"Member removed"` */
  memberRemoved: "Member removed",
  /** @remarks `"Member role updated"` */
  memberRoleUpdated: "Member role updated",
  /** @remarks `"Invitation sent"` */
  invitationSent: "Invitation sent",
  /** @remarks `"Invitation removed"` */
  invitationRemoved: "Invitation removed",
  /** @remarks `"Organization deleted"` */
  organizationDeleted: "Organization deleted",
  /** @remarks `"Organization created"` */
  organizationCreated: "Organization created",
  /** @remarks `"You left the organization"` */
  organizationLeft: "You left the organization",
  /** @remarks `"Remove member"` */
  removeMember: "Remove member",
  /** @remarks `"Accept invitation"` */
  acceptInvitation: "Accept",
  /** @remarks `"Reject invitation"` — invitee declines (not org cancel) */
  rejectInvitation: "Reject invitation",
  /** @remarks `"Logo"` */
  logo: "Logo",
  /** @remarks Toast after changing organization logo */
  logoChangedSuccess: "Logo updated successfully",
  /** @remarks Toast after removing organization logo */
  logoDeletedSuccess: "Logo removed successfully",
  /** @remarks `"Change logo"` */
  changeLogo: "Change logo",
  /** @remarks `"Delete logo"` */
  deleteLogo: "Delete logo",
  /** @remarks `"Upload logo"` */
  uploadLogo: "Upload logo"
} as const

export type OrganizationLocalization = typeof organizationLocalization
