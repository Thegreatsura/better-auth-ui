import type { AvatarConfig } from "../../config/avatar-config"
import { createAuthPlugin } from "../../lib/create-auth-plugin"
import { resizeAvatar } from "../../lib/utils"
// Side-effect import so declaration merging attaches to the same `view-paths`
// module instance consumers resolve via `@better-auth-ui/core`.
import type {} from "../../lib/view-paths"
import {
  type OrganizationLocalization,
  organizationLocalization
} from "./organization-localization"
import type { OrganizationViewPaths } from "./organization-view-paths"

function resolveLogoConfig(partial?: Partial<AvatarConfig>): AvatarConfig {
  return {
    enabled: partial?.enabled ?? true,
    resize: partial?.resize ?? resizeAvatar,
    size: partial?.size ?? 256,
    extension: partial?.extension ?? "png",
    upload: partial?.upload,
    delete: partial?.delete
  }
}

/** Built-in role keys whose default labels come from {@link OrganizationLocalization}. */
const defaultLocalizedRoleKeys = ["owner", "admin", "member"] as const

function defaultOrganizationRolesFromLocalization(
  localization: OrganizationLocalization
): Record<string, string> {
  return Object.fromEntries(
    defaultLocalizedRoleKeys.map((key) => [key, localization[key]])
  )
}

declare module "../../lib/view-paths" {
  /** Widens `SettingsViewPaths` by adding the `"organizations"` path when this plugin is imported. */
  interface SettingsViewPaths {
    /** @default "organizations" */
    organizations?: string
  }
}

declare module "../../lib/auth-plugin" {
  interface AuthPluginViewPaths {
    organization?: Partial<OrganizationViewPaths>
  }
}

export type OrganizationPluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `OrganizationLocalization`
   */
  localization?: Partial<OrganizationLocalization>
  /**
   * URL segment for the organizations settings view.
   * @remarks `string`
   * @default "organizations"
   */
  path?: string
  /**
   * URL segment for `/organization/...` profile and danger zone tab.
   * @default "settings"
   */
  organizationSettingsPath?: string
  /**
   * URL segment for `/organization/...` members and invitations tab.
   * @default "members"
   */
  organizationMembersPath?: string
  /**
   * Organization logo upload, optimization, and deletion configuration.
   * Same shape as {@link AvatarConfig} used for user avatars (`AuthConfig.avatar`).
   * @remarks `AvatarConfig`
   * @default { enabled: true, resize: resizeAvatar, size: 256, extension: "png" }
   */
  logo?: Partial<AvatarConfig>
  /**
   * Map of role keys to display labels. When omitted, defaults to localized
   * labels for `owner`, `admin`, and `member` (from `localization.owner`
   * etc.) plus {@link OrganizationPluginOptions.additionalRoles}. When set,
   * replaces that default map entirely; use {@link OrganizationPluginOptions.additionalRoles}
   * to add more labels on top. Looked up at render time via `roles?.[role]`.
   * @remarks `Record<string, string>`
   */
  roles?: Record<string, string>
  /**
   * Extra role labels merged after the effective role map (either
   * {@link OrganizationPluginOptions.roles} when provided, or the localized
   * defaults). Use this for custom server roles without redefining built-in
   * labels.
   * @remarks `Record<string, string>`
   */
  additionalRoles?: Record<string, string>
}

export const organizationPlugin = createAuthPlugin(
  "organization",
  (options: OrganizationPluginOptions = {}) => {
    const localization = {
      ...organizationLocalization,
      ...options.localization
    }
    const defaultRoles = defaultOrganizationRolesFromLocalization(localization)
    const baseRoles = options.roles !== undefined ? options.roles : defaultRoles
    return {
      localization,
      logo: resolveLogoConfig(options.logo),
      roles: {
        ...baseRoles,
        ...options.additionalRoles
      },
      viewPaths: {
        settings: { organizations: options.path ?? "organizations" },
        organization: {
          settings: options.organizationSettingsPath ?? "settings",
          members: options.organizationMembersPath ?? "members"
        }
      }
    }
  }
)
