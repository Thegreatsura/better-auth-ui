import type { AuthPlugin } from "../../lib/auth-plugin"
import {
  type PasskeyLocalization,
  passkeyLocalization
} from "./passkey-localization"

export type PasskeyPluginOptions = {
  localization?: Partial<PasskeyLocalization>
}

export function passkeyPlugin(options: PasskeyPluginOptions = {}) {
  return {
    id: "passkey",
    localization: { ...passkeyLocalization, ...options.localization }
  } satisfies AuthPlugin
}
