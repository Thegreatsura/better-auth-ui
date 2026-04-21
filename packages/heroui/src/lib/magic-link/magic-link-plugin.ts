import {
  magicLinkPlugin as coreMagicLinkPlugin,
  type MagicLinkPluginOptions
} from "@better-auth-ui/core/plugins"

import { MagicLink } from "../../components/auth/magic-link"
import { MagicLinkButton } from "../../components/auth/magic-link-button"
import type { AuthPlugin } from "../auth-plugin"

export function magicLinkPlugin(options: MagicLinkPluginOptions = {}) {
  return {
    ...coreMagicLinkPlugin(options),
    authButtons: [MagicLinkButton],
    views: {
      auth: { magicLink: MagicLink }
    },
    // When `emailAndPassword.enabled === false`, /auth/sign-in renders the
    // magic-link form instead of the disabled password form.
    fallbackFor: {
      signIn: MagicLink
    }
  } satisfies AuthPlugin
}
