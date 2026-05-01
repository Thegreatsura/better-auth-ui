import {
  multiSessionPlugin as coreMultiSessionPlugin,
  type MultiSessionPluginOptions
} from "@better-auth-ui/core/plugins"

import { ManageAccounts } from "@/components/multi-session/manage-accounts"
import { SwitchAccountSubmenu } from "@/components/multi-session/switch-account-submenu"
import type { AuthPlugin } from "../auth-plugin"

export function multiSessionPlugin(options: MultiSessionPluginOptions = {}) {
  return {
    ...coreMultiSessionPlugin(options),
    accountCards: [ManageAccounts],
    userMenuItems: [SwitchAccountSubmenu]
  } satisfies AuthPlugin
}
