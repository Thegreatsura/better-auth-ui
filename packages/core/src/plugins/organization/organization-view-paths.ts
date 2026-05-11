/**
 * Path segments under `/organization/...` contributed by `organizationPlugin`.
 *
 * Read at runtime via `useAuthPlugin(organizationPlugin).viewPaths.organization`.
 */
export interface OrganizationViewPaths {
  /**
   * Path segment for organization profile and danger zone
   * @default "settings"
   */
  settings: string
  /**
   * Path segment for members and invitations
   * @default "members"
   */
  members: string
}

/** Valid organization management tab / route key. */
export type OrganizationView = keyof OrganizationViewPaths
