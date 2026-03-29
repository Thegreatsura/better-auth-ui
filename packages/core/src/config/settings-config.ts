import type { AppearanceConfig } from "./appearance-config"
import type { AvatarConfig } from "./avatar-config"

/**
 * Configuration options for user settings.
 */
export type SettingsConfig = {
  /**
   * Appearance/theme configuration
   * @default { themes: ["system", "light", "dark"] }
   */
  appearance: AppearanceConfig
  /**
   * Avatar upload, optimization, and deletion configuration.
   * @default { enabled: true, optimize: optimizeAvatar, size: 256 }
   */
  avatar: AvatarConfig
}
