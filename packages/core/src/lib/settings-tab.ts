import type { SettingsView } from "./view-paths"

/**
 * Tab contributions for the settings page.
 *
 * Plugins declare `settingsTabs` on their object to add extra tabs.
 * Read at runtime via `useAuthPlugin(plugin).settingsTabs`.
 */
export interface SettingsTab {
  /**
   * Settings view id — must match a key on `plugin.viewPaths.settings` and
   * {@link SettingsView} (including keys added via `declare module` augmentation).
   */
  view: SettingsView
  /** Display label */
  label: string
  /** Component rendered in the tab panel */
  component: unknown
}
