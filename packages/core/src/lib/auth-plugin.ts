/**
 * View-path contributions kept on the plugin object.
 *
 * Plugins that add routable sub-pages (e.g. `magicLinkPlugin` adds
 * `/auth/magic-link`) declare the URL segment under the matching section.
 * Read at runtime via `useAuthPlugin(plugin).viewPaths.*`.
 */
export type AuthPluginViewPaths = {
  auth?: Record<string, string>
  settings?: Record<string, string>
}

/**
 * Core authentication plugin interface.
 *
 * Defines the identity, localization, and routing contributions every plugin
 * may ship. UI packages extend this with framework-specific slot components
 * (see `AuthPlugin` in `@better-auth-ui/react`).
 */
export interface AuthPlugin {
  /** Unique identifier. Used as a React key and localization namespace. */
  id: string
  /** Localization defaults contributed by the plugin. */
  localization?: Record<string, unknown>
  /**
   * View-path segments the plugin contributes. Read by host components
   * (e.g. `<Auth>`, `MagicLinkButton`) via `useAuthPlugin(plugin).viewPaths`.
   */
  viewPaths?: AuthPluginViewPaths
}
