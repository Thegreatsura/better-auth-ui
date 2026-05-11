import type { SettingsTab } from "@better-auth-ui/core"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  organizationPlugin as coreOrganizationPlugin,
  type OrganizationPluginOptions,
  organizationLocalization
} from "@better-auth-ui/core/plugins"

import { OrganizationsSettings } from "../../components/auth/organization/organizations-settings"

export const organizationPlugin = createAuthPlugin(
  coreOrganizationPlugin.id,
  (options: OrganizationPluginOptions = {}) => {
    const base = coreOrganizationPlugin(options)
    const mergedOrganizationLocalization = {
      ...organizationLocalization,
      ...(base.localization as Partial<typeof organizationLocalization>)
    }

    const settingsTabs: SettingsTab[] = [
      {
        key: "organizations",
        label: mergedOrganizationLocalization.organizations,
        component: OrganizationsSettings
      }
    ]

    return {
      ...base,
      settingsTabs
    }
  }
)
