import { createAuthPlugin } from "@better-auth-ui/core"
import {
  organizationPlugin as coreOrganizationPlugin,
  type OrganizationPluginOptions
} from "@better-auth-ui/core/plugins"

import { OrganizationsSettings } from "../../components/auth/organization/organizations-settings"

export const organizationPlugin = createAuthPlugin(
  coreOrganizationPlugin.id,
  (options: OrganizationPluginOptions = {}) => {
    const coreOptions = coreOrganizationPlugin(options)

    return {
      ...coreOptions,
      settingsTabs: [
        {
          view: "organizations",
          label: coreOptions.localization.organizations,
          component: OrganizationsSettings
        }
      ]
    }
  }
)
