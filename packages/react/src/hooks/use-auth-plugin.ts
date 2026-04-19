"use client"

import { useMemo } from "react"

import { useAuth } from "../components/auth/auth-provider"
import type { AuthPlugin } from "../lib/auth-plugin"

/**
 * Access a registered plugin by passing its factory.
 *
 * Use inside plugin slot components to read plugin state (localization,
 * config, etc.) without prop drilling.
 *
 * Throws if the plugin isn't registered on `AuthProvider` — this is an
 * invariant: plugin slot components only render when their plugin is in
 * `plugins`.
 *
 * @example
 * ```tsx
 * function PasskeyButton() {
 *   const { localization } = useAuthPlugin(passkeyPlugin)
 *   return <button>{localization.passkey}</button>
 * }
 * ```
 */
export function useAuthPlugin<T extends AuthPlugin>(pluginFactory: () => T): T {
  const { plugins } = useAuth()
  const id = useMemo(() => pluginFactory().id, [pluginFactory])
  const plugin = plugins?.find((p) => p.id === id)

  if (!plugin) {
    throw new Error(
      `[Better Auth UI] useAuthPlugin: plugin "${id}" is not registered on AuthProvider.`
    )
  }

  return plugin as T
}
