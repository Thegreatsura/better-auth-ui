import type {
  AuthView,
  AuthPlugin as CoreAuthPlugin
} from "@better-auth-ui/core"
import type { ComponentType, ReactNode } from "react"

export type { AuthPluginViewPaths } from "@better-auth-ui/core"

/** Props for plugin-contributed auth buttons (e.g. passkey, magic link). */
export type AuthButtonProps = {
  className?: string
  children?: ReactNode
  isPending?: boolean
  /** Current auth view — lets buttons context-switch (e.g. show "back to sign-in"). */
  view?: AuthView
}

/** Props for plugin-contributed cards under `/settings/security`. */
export type SecurityCardProps = {
  className?: string
  children?: ReactNode
}

/** Props for plugin-contributed cards under `/settings/account`. */
export type AccountCardProps = {
  className?: string
  children?: ReactNode
}

/** Props for plugin-contributed items in the `UserButton` dropdown. */
export type UserMenuItemProps = {
  className?: string
}

/** Framework-agnostic slot component shapes. UI packages narrow these via `TComponents`. */
export type AuthPluginComponents = {
  /** Rendered alongside the submit button in sign-in / sign-up / forgot-password. */
  authButtons?: ComponentType<AuthButtonProps>[]
  /** Rendered as cards inside security settings (e.g. passkey list). */
  securityCards?: ComponentType<SecurityCardProps>[]
  /** Rendered as cards inside account settings (e.g. multi-session accounts). */
  accountCards?: ComponentType<AccountCardProps>[]
  /** Rendered as items inside the `UserButton` dropdown (e.g. account switcher). */
  userMenuItems?: ComponentType<UserMenuItemProps>[]
}

/** Plugin view overrides keyed by `AuthPluginViewPaths`. Always replaces the built-in view. */
export type AuthPluginViews<TAuthViewProps, TSettingsViewProps> = {
  auth?: Record<string, ComponentType<TAuthViewProps>>
  settings?: Record<string, ComponentType<TSettingsViewProps>>
}

/** Conditional view replacements — only used when the built-in flow isn't viable. */
export type AuthPluginFallbackViews<TAuthViewProps> = {
  auth?: {
    /** Rendered at `/auth/sign-in` when `emailAndPassword.enabled === false`. */
    signIn?: ComponentType<TAuthViewProps>
  }
}

/**
 * UI-aware plugin definition. UI packages bind the generics in their own
 * `AuthPlugin` re-export so plugin authors don't have to.
 *
 * @typeParam TComponents - Slot component shapes (e.g. heroui variant unions).
 * @typeParam TAuthViewProps - Props the `<Auth>` router spreads onto plugin auth views.
 * @typeParam TSettingsViewProps - Props the `<Settings>` router spreads onto plugin settings views.
 */
export type AuthPlugin<
  TComponents = AuthPluginComponents,
  TAuthViewProps = unknown,
  TSettingsViewProps = unknown
> = CoreAuthPlugin &
  TComponents & {
    views?: AuthPluginViews<TAuthViewProps, TSettingsViewProps>
    fallbackViews?: AuthPluginFallbackViews<TAuthViewProps>
  }
