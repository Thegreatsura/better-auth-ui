import { createAuthPlugin } from "@better-auth-ui/core"
import { CaptchaFoxWidget } from "./captchafox-widget"

export type CaptchaFoxPluginOptions = {
  /** CaptchaFox site key */
  siteKey: string
}

export const captchafoxPlugin = createAuthPlugin(
  "captchafox",
  (options: CaptchaFoxPluginOptions) => ({
    siteKey: options.siteKey,
    captchaComponent: CaptchaFoxWidget
  })
)
