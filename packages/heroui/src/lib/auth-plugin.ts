import type {
  AccountCardProps,
  AuthButtonProps,
  AuthPlugin as AuthPluginPrimitive,
  SecurityCardProps,
  UserMenuItemProps
} from "@better-auth-ui/react"
import type { ButtonProps, CardProps } from "@heroui/react"
import type { ComponentType } from "react"

import type { SocialLayout } from "../components/auth/provider-buttons"

/** Heroui slot component shapes — narrows the framework-agnostic defaults with heroui variant unions. */
export type AuthPluginComponents = {
  /** Rendered alongside the submit button in sign-in / sign-up / forgot-password. */
  authButtons?: ComponentType<
    AuthButtonProps & { variant?: ButtonProps["variant"] }
  >[]
  /** Rendered as cards inside security settings (e.g. passkey list). */
  securityCards?: ComponentType<
    SecurityCardProps & { variant?: CardProps["variant"] }
  >[]
  /** Rendered as cards inside account settings (e.g. multi-session accounts). */
  accountCards?: ComponentType<
    AccountCardProps & { variant?: CardProps["variant"] }
  >[]
  /** Rendered as items inside the `UserButton` dropdown (e.g. account switcher). */
  userMenuItems?: ComponentType<UserMenuItemProps>[]
}

/** Props the heroui `<Auth>` router spreads onto plugin-contributed auth views. */
export type AuthViewProps = Omit<CardProps, "children"> & {
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
}

/** Props the heroui `<Settings>` router spreads onto plugin-contributed settings views. */
export type SettingsViewProps = Omit<CardProps, "children">

/** Heroui plugin type. Plugin authors import this from `@better-auth-ui/heroui`. */
export type AuthPlugin = AuthPluginPrimitive<
  AuthPluginComponents,
  AuthViewProps,
  SettingsViewProps
>
