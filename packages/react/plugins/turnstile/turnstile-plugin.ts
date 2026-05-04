import { createAuthPlugin } from "@better-auth-ui/core"

import { TurnstileWidget } from "./turnstile-widget"

export type TurnstilePluginOptions = {
  /** Cloudflare Turnstile site key */
  siteKey: string
}

export const turnstilePlugin = createAuthPlugin(
  "turnstile",
  (options: TurnstilePluginOptions) => ({
    siteKey: options.siteKey,
    captchaComponent: TurnstileWidget
  })
)
