import type { AuthPlugin } from "../../lib/auth-plugin"
import {
  type MultiSessionLocalization,
  multiSessionLocalization
} from "./multi-session-localization"

export type MultiSessionPluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `MultiSessionLocalization`
   */
  localization?: Partial<MultiSessionLocalization>
}

export function multiSessionPlugin(options: MultiSessionPluginOptions = {}) {
  return {
    id: "multiSession",
    localization: { ...multiSessionLocalization, ...options.localization }
  } satisfies AuthPlugin
}