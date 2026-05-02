import {
  themePlugin as coreThemePlugin,
  type ThemePluginOptions
} from "@better-auth-ui/core/plugins"

import { Appearance } from "../../components/theme/appearance"
import { ThemeToggleItem } from "../../components/theme/theme-toggle-item"
import type { AuthPlugin } from "../auth-plugin"

export function themePlugin(options: ThemePluginOptions = {}) {
  return {
    ...coreThemePlugin(options),
    userMenuItems: [ThemeToggleItem],
    accountCards: [Appearance]
  } satisfies AuthPlugin
}
