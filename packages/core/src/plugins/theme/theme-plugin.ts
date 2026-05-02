import type { AuthPlugin } from "../../lib/auth-plugin"
import { type ThemeLocalization, themeLocalization } from "./theme-localization"

export type ThemePluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `ThemeLocalization`
   */
  localization?: Partial<ThemeLocalization>
  /**
   * Initial theme value
   */
  theme?: string
  /**
   * Function to set the theme
   */
  setTheme: (theme: string) => void
  /**
   * Available theme options
   * @default ["system", "light", "dark"]
   */
  themes?: string[]
}

export function themePlugin(options: ThemePluginOptions) {
  return {
    id: "theme" as const,
    localization: { ...themeLocalization, ...options.localization },
    theme: options.theme ?? "system",
    setTheme: options.setTheme ?? (() => {}),
    themes: options.themes ?? ["system", "light", "dark"]
  } satisfies AuthPlugin
}
