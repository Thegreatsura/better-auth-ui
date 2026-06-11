import type { AuthPluginBase } from "@better-auth-ui/core"
import type { Component } from "solid-js"

export type CaptchaComponent = Component

export type SolidAuthPlugin = AuthPluginBase & {
  /** Captcha widget rendered above submit buttons in auth forms. */
  captchaComponent?: CaptchaComponent
  /** Allow app-owned copied components to add Solid-specific plugin slots. */
  [key: string]: unknown
}

declare module "@better-auth-ui/core" {
  interface AuthPluginRegister {
    solid: SolidAuthPlugin
  }
}

export type { AuthPluginViewPaths } from "@better-auth-ui/core"
export type AuthPlugin = SolidAuthPlugin
