/**
 * Core authentication plugin interface.
 *
 * Defines the identity and localization contract; UI packages extend
 * this type with their own slot components.
 */
export interface AuthPlugin {
  /** Unique identifier. Used as a React key and localization namespace. */
  id: string
  /** Localization defaults contributed by the plugin. */
  localization?: Record<string, unknown>
}
