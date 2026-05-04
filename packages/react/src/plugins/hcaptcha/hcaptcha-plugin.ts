import { createAuthPlugin } from "@better-auth-ui/core"

import { HCaptchaWidget } from "./hcaptcha-widget"

export type HCaptchaPluginOptions = {
  /** hCaptcha site key */
  siteKey: string
}

export const hcaptchaPlugin = createAuthPlugin(
  "hcaptcha",
  (options: HCaptchaPluginOptions) => ({
    siteKey: options.siteKey,
    captchaComponent: HCaptchaWidget
  })
)
