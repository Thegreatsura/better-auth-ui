import { createAuthPlugin } from "@better-auth-ui/core"
import {
  themePlugin as coreThemePlugin,
  type ThemeLocalization
} from "@better-auth-ui/core/plugins"

import { Appearance } from "@/components/theme/appearance"
import { ThemeToggleItem } from "@/components/theme/theme-toggle-item"

/**
 * Hook shape compatible with `next-themes`' `useTheme` and similar APIs. The
 * hook is invoked inside the plugin factory so consumers can register the
 * plugin in the same component as their `<ThemeProvider>` without an extra
 * inner component.
 */
export type UseThemeHook = () => {
  theme?: string
  setTheme: (theme: string) => void
  themes?: string[]
}

type BaseThemeOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `ThemeLocalization`
   */
  localization?: Partial<ThemeLocalization>
  /**
   * Initial theme value.
   */
  theme?: string
  /**
   * Available theme options.
   * @default ["system", "light", "dark"]
   */
  themes?: string[]
}

export type ThemePluginOptions = BaseThemeOptions &
  (
    | {
        /**
         * A theme hook (e.g. next-themes' `useTheme`) called inside the
         * plugin factory to read live theme state. When provided,
         * `setTheme` is not required.
         */
        useTheme: UseThemeHook
        setTheme?: never
      }
    | {
        /** Function to set the theme. */
        setTheme: (theme: string) => void
        useTheme?: never
      }
  )

export const themePlugin = createAuthPlugin(
  coreThemePlugin.id,
  ({ useTheme, ...rest }: ThemePluginOptions) => {
    // No-op `setTheme` baseline keeps core's required option satisfied when
    // the consumer is passing a hook (and therefore omitting `setTheme`).
    const base = coreThemePlugin({ setTheme: () => {}, ...rest })
    return {
      ...base,
      // Slot components always call `plugin.useTheme()` — invoking the hook
      // inside their render keeps it in scope of any `<ThemeProvider>` the
      // consumer mounts. When the consumer passed static config instead, we
      // synthesize a stub that returns those same values.
      useTheme:
        useTheme ??
        (() => ({
          theme: base.theme,
          setTheme: base.setTheme,
          themes: base.themes
        })),
      userMenuItems: [ThemeToggleItem],
      accountCards: [Appearance]
    }
  }
)
