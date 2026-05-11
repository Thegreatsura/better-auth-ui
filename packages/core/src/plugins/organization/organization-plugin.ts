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

declare module "../../lib/view-paths" {
  /** Widens `SettingsViewPaths` by adding the `"organizations"` path when this plugin is imported. */
  interface SettingsViewPaths {
    /** @default "organizations" */
    organizations?: string
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
}

export const organizationPlugin = createAuthPlugin(
  "organization",
  (options: OrganizationPluginOptions = {}) => ({
    localization: {
      ...organizationLocalization,
      ...options.localization
    },
    logo: resolveLogoConfig(options.logo),
    viewPaths: {
      settings: { organizations: options.path ?? "organizations" },
      organization: {
        settings: options.organizationSettingsPath ?? "settings",
        members: options.organizationMembersPath ?? "members"
      }
    }
  })
)
