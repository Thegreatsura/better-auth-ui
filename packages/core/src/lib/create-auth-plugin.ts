/**
 * Creates a plugin factory and attaches its `id` as a static property.
 *
 * Lifts the plugin's `id` out of the factory's runtime output so consumers
 * (e.g. `useAuthPlugin`) can read it without invoking the factory. This lets
 * plugins keep required options (like `themePlugin`'s `setTheme`) without
 * forcing every factory to be callable with zero arguments.
 *
 * The returned factory:
 * - is callable with the original arguments and returns the factory's result
 *   merged with `{ id }`
 * - exposes `id` as a static property so it can be read at registration or
 *   lookup time without allocating a plugin instance
 *
 * Type safety for the plugin's shape is enforced at the registration site
 * (`<AuthProvider plugins={[…]} />`) where `plugins` is typed as `AuthPlugin[]`.
 *
 * @example
 * ```ts
 * export const themePlugin = createAuthPlugin(
 *   "theme",
 *   (options: ThemePluginOptions) => ({
 *     localization: { ...themeLocalization, ...options.localization },
 *     theme: options.theme ?? "system",
 *     setTheme: options.setTheme,
 *     themes: options.themes ?? ["system", "light", "dark"]
 *   })
 * )
 *
 * themePlugin.id // "theme"
 * themePlugin({ setTheme }) // { id: "theme", localization, theme, setTheme, themes }
 * ```
 */
export function createAuthPlugin<
  const TId extends string,
  TArgs extends unknown[],
  TResult extends object
>(
  id: TId,
  factory: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult & { id: TId }) & { id: TId } {
  const wrapped = (...args: TArgs) => ({ ...factory(...args), id })
  return Object.assign(wrapped, { id }) as ((
    ...args: TArgs
  ) => TResult & { id: TId }) & { id: TId }
}
