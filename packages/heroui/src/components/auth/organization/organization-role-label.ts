import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"

/** Maps organization role keys to plugin localization labels. */
export function localizedOrganizationRole(
  role: string,
  localization: OrganizationLocalization
): string {
  if (role === "owner") return localization.owner
  if (role === "admin") return localization.admin
  if (role === "member") return localization.member

  return role.charAt(0).toUpperCase() + role.slice(1)
}
