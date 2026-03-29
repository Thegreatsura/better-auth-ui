/**
 * Available theme options for the application.
 */
export type Theme = "system" | "light" | "dark"

/**
 * Configuration options for appearance/theme settings.
 */
export type AppearanceConfig = {
  /**
   * Function to set the application theme
   * @param theme - The theme value to set
   */
  setTheme?: (theme: string) => void
  /**
   * Current theme value
   */
  theme?: string
  /**
   * Available theme options to display in the theme switcher
   * @default ["system", "light", "dark"]
   */
  themes: Theme[]
}
