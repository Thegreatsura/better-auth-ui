/**
 * View-path contributions merged into `AuthConfig.viewPaths`.
 *
 * Plugins that add routable sub-pages (e.g. `magicLinkPlugin` adds
 * `/auth/magic-link`) declare the URL segment under the matching section.
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
   * View-path segments the plugin contributes. Merged into
   * `AuthConfig.viewPaths` at runtime by `AuthProvider`, and composed
   * statically via `resolveViewPaths(plugins)` for route loaders.
   */
  viewPaths?: AuthPluginViewPaths
}
