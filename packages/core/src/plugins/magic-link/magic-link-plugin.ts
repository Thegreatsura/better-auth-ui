import type { AuthPlugin } from "../../lib/auth-plugin"
import {
  type MagicLinkLocalization,
  magicLinkLocalization
} from "./magic-link-localization"

declare module "@better-auth-ui/core" {
  /** Widens `AuthViewPaths` by adding the `"magicLink"` path when this plugin is imported. */
  interface AuthViewPaths {
    /** @default "magic-link" */
    magicLink?: string
  }
}

export type MagicLinkPluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `MagicLinkLocalization`
   */
  localization?: Partial<MagicLinkLocalization>
  /**
   * URL segment for the magic-link view.
   * @remarks `string`
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
