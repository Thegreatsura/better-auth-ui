import type {
  AccountCardProps,
  AuthButtonProps,
  AuthPlugin as AuthPluginPrimitive,
  SecurityCardProps,
  UserMenuItemProps
} from "@better-auth-ui/react"
import type { ButtonProps, CardProps } from "@heroui/react"
import type { ComponentType } from "react"

/**
 * Heroui-specific slot component prop shapes. Narrows the framework-
 * agnostic defaults from `@better-auth-ui/react` with heroui primitives
 * (variant unions, etc.).
 *
 * Slots are arrays so a single plugin can contribute multiple components to
 * the same region (e.g. a twoFactor plugin pushing TOTP, backup-code, and
 * trusted-device cards into `securityCards`).
 */
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

/**
 * Heroui plugin type — carries heroui-specific slot component shapes.
 * Plugin authors import this from `@better-auth-ui/heroui`.
 */
export type AuthPlugin = AuthPluginPrimitive<AuthPluginComponents>
