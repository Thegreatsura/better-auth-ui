import { createAuthPlugin } from "@better-auth-ui/core"

import { TurnstileWidget } from "./turnstile-widget"

/** Options for the Cloudflare Turnstile widget component. */
export type TurnstileOptions = {
  tabIndex?: number
  responseField?: boolean
  responseFieldName?: string
  retryInterval?: number
  size?: "normal" | "compact" | "flexible" | "invisible"
  refreshExpired?: "never" | "manual" | "auto"
  refreshTimeout?: "never" | "manual" | "auto"
  feedbackEnabled?: boolean
  action?: string
  cData?: string
  theme?: "auto" | "light" | "dark"
  retry?: "never" | "auto"
  language?: string
  execution?: "render" | "execute"
  appearance?: "always" | "execute" | "interaction-only"
}

export type TurnstilePluginOptions = {
  /** Cloudflare Turnstile site key */
  siteKey: string
  /** Turnstile Component options */
  options?: TurnstileOptions
}

export const turnstilePlugin = createAuthPlugin(
  "turnstile",
  (options: TurnstilePluginOptions) => ({
    siteKey: options.siteKey,
    options: options.options,
    captchaComponent: TurnstileWidget
  })
)
