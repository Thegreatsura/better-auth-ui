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
export interface AuthPluginBase {
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

/**
 * Module-augmentation slot for narrowing the plugin type returned by
 * `useAuth()`. UI packages widen `plugin` here (e.g. heroui's variant-typed
 * `AuthPlugin`) so consumers don't have to pass `useAuth<AuthPlugin>()`.
 *
 * @example
 * declare module "@better-auth-ui/core" {
 *   interface AuthPluginRegister { plugin: HeroUIAuthPlugin }
 * }
 */
// biome-ignore lint/suspicious/noEmptyInterface: declaration-merging slot
export interface AuthPluginRegister {}

/**
 * Resolved auth plugin type. UI packages widen this via the
 * `AuthPluginRegister` module-augmentation slot; without any augmentation it
 * falls back to the framework-agnostic `AuthPluginBase`.
 */
export type AuthPlugin = AuthPluginRegister extends { plugin: infer P }
  ? P extends AuthPluginBase
    ? P
    : AuthPluginBase
  : AuthPluginBase
