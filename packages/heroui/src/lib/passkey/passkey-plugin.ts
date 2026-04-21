import {
  passkeyPlugin as corePasskeyPlugin,
  type PasskeyPluginOptions
} from "@better-auth-ui/core/plugins"

import { PasskeyButton } from "../../components/passkey/passkey-button"
import { Passkeys } from "../../components/passkey/passkeys"
import type { AuthPlugin } from "../auth-plugin"

export function passkeyPlugin(options: PasskeyPluginOptions = {}) {
  return {
    ...corePasskeyPlugin(options),
    authButtons: [PasskeyButton],
    securityCards: [Passkeys]
  } satisfies AuthPlugin
}
