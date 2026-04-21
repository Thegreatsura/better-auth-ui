import type { AuthPlugin } from "./auth-plugin"
import type { DeepPartial } from "./deep-partial"
import { viewPaths as defaultViewPaths, type ViewPaths } from "./view-paths"

/**
 * Compose the final `ViewPaths` object from the built-in defaults, any
 * plugin-contributed segments, and optional user overrides.
 *
 * Use this to build a single source of truth for view paths that route
 * loaders (outside React) and `AuthProvider` (inside React) both agree on.
 *
 * @example
 * ```ts
 * // lib/plugins.ts
 * import { resolveViewPaths } from "@better-auth-ui/core"
 * import { magicLinkPlugin } from "./plugins/magic-link-plugin"
 * import { passkeyPlugin } from "./plugins/passkey-plugin"
 *
 * export const plugins = [passkeyPlugin(), magicLinkPlugin()]
 * export const viewPaths = resolveViewPaths(plugins)
 * ```
 *
 * @example
 * ```ts
 * // routes/auth/$path.tsx — the validation stays a one-liner
 * import { viewPaths } from "@/lib/plugins"
 *
 * beforeLoad({ params: { path } }) {
 *   if (!Object.values(viewPaths.auth).includes(path)) throw redirect(...)
 * }
 * ```
 *
 * @param plugins - Registered plugins whose `viewPaths` contributions are folded in.
 * @param overrides - Optional final overrides (e.g. custom URL segments).
 * @returns Merged view-path config with every plugin's contributions applied.
 */
export function resolveViewPaths(
  plugins: readonly AuthPlugin[] = [],
  overrides?: DeepPartial<ViewPaths>
): ViewPaths {
  const pluginAuth: Record<string, string> = {}
  const pluginSettings: Record<string, string> = {}
  for (const plugin of plugins) {
    Object.assign(pluginAuth, plugin.viewPaths?.auth ?? {})
    Object.assign(pluginSettings, plugin.viewPaths?.settings ?? {})
  }

  return {
    auth: {
      ...defaultViewPaths.auth,
      ...pluginAuth,
      ...overrides?.auth
    },
    settings: {
      ...defaultViewPaths.settings,
      ...pluginSettings,
      ...overrides?.settings
    }
  }
}
