import { createAuthPlugin } from "../../lib/create-auth-plugin"
// Side-effect import so this file participates in declaration merging on the
// same module instance that external consumers reach via `@better-auth-ui/core`.
import type {} from "../../lib/view-paths"
import {
  type MagicLinkLocalization,
  magicLinkLocalization
} from "./magic-link-localization"

declare module "../../lib/view-paths" {
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

export const magicLinkPlugin = createAuthPlugin(
  "magicLink",
  (options: MagicLinkPluginOptions = {}) => ({
    localization: { ...magicLinkLocalization, ...options.localization },
    viewPaths: {
      auth: { magicLink: options.path ?? "magic-link" }
    }
  })
)
