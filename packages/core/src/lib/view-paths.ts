/**
 * View path segments for authentication routes.
 *
 * Contains the fixed built-ins every install ships with. Plugin-contributed
 * paths (e.g. `magicLinkPlugin`'s `magicLink`) live on the plugin object and
 * are read via `useAuthPlugin(plugin).viewPaths.auth.*`.
 */
export interface AuthViewPaths {
  /**
   * Path segment for the sign-in view
   * @default "sign-in"
   */
  signIn: string
  /**
   * Path segment for the sign-up view
   * @default "sign-up"
   */
  signUp: string
  /**
   * Path segment for the forgot password view
   * @default "forgot-password"
   */
  forgotPassword: string
  /**
   * Path segment for the reset password view
   * @default "reset-password"
   */
  resetPassword: string
  /**
   * Path segment for the sign-out view
   * @default "sign-out"
   */
  signOut: string
}

/**
 * View path segments for settings routes.
 *
 * Plugins augment this interface (via `declare module` in their own package)
 * when they add settings tabs. Read segments from
 * `useAuthPlugin(plugin).viewPaths.settings.*`.
 */
export interface SettingsViewPaths {
  /**
   * Path segment for the account settings view
   * @default "account"
   */
  account: string
  /**
   * Path segment for the security settings view
   * @default "security"
   */
  security: string
}

/**
 * View path configuration for authentication and settings routes.
 */
export type ViewPaths = {
  /** Auth view path segments */
  auth: AuthViewPaths
  /** Settings view path segments */
  settings: SettingsViewPaths
}

export const viewPaths: ViewPaths = {
  auth: {
    signIn: "sign-in",
    signUp: "sign-up",
    forgotPassword: "forgot-password",
    resetPassword: "reset-password",
    signOut: "sign-out"
  },
  settings: {
    account: "account",
    security: "security"
  }
}

/**
 * Valid auth view key.
 */
export type AuthView = keyof AuthViewPaths

/**
 * Valid settings view key.
 */
export type SettingsView = keyof SettingsViewPaths

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
