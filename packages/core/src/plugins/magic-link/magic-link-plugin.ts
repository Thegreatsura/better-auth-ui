import type { AuthPlugin } from "../../lib/auth-plugin"
import {
  type MagicLinkLocalization,
  magicLinkLocalization
} from "./magic-link-localization"

export type MagicLinkPluginOptions = {
  /** Partial override for the plugin's default localization strings. */
  localization?: Partial<MagicLinkLocalization>
  /**
   * URL segment for the magic-link view.
   * @default "magic-link"
   */
  path?: string
}

export function magicLinkPlugin(options: MagicLinkPluginOptions = {}) {
  return {
    id: "magicLink",
    localization: { ...magicLinkLocalization, ...options.localization },
    viewPaths: {
      auth: { magicLink: options.path ?? "magic-link" }
    }
  } satisfies AuthPlugin
}
