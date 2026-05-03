import { createAuthPlugin } from "../../lib/create-auth-plugin"
import {
  type PasskeyLocalization,
  passkeyLocalization
} from "./passkey-localization"

export type PasskeyPluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `PasskeyLocalization`
   */
  localization?: Partial<PasskeyLocalization>
}

export const passkeyPlugin = createAuthPlugin(
  "passkey",
  (options: PasskeyPluginOptions = {}) => ({
    localization: { ...passkeyLocalization, ...options.localization }
  })
)
