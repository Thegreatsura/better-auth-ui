import {
  multiSessionPlugin as coreMultiSessionPlugin,
  type MultiSessionPluginOptions
} from "@better-auth-ui/core/plugins"

import { ManageAccounts } from "@/components/settings/account/manage-accounts"
import { SwitchAccountItem } from "@/components/user/switch-account-item"
import type { AuthPlugin } from "../auth-plugin"

export function multiSessionPlugin(options: MultiSessionPluginOptions = {}) {
  return {
    ...coreMultiSessionPlugin(options),
    accountCards: [ManageAccounts],
    userMenuItems: [SwitchAccountItem]
  } satisfies AuthPlugin
}
