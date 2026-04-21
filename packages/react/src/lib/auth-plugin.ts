import type { AuthPlugin as CoreAuthPlugin } from "@better-auth-ui/core"
import type { ComponentType, ReactNode } from "react"

export type { AuthPluginViewPaths } from "@better-auth-ui/core"

/**
 * Props passed to every plugin-contributed auth button (e.g. passkey, magic
 * link). Rendered alongside the submit button in sign-in / sign-up /
 * forgot-password forms.
 */
export type AuthButtonProps = {
  className?: string
  children?: ReactNode
  isPending?: boolean
}

/**
 * Props passed to every plugin-contributed security-settings card. Rendered
 * in the card stack under `/settings/security` (e.g. passkey list).
 */
export type SecurityCardProps = {
  className?: string
  children?: ReactNode
}

/**
 * Props passed to every plugin-contributed account-settings card. Rendered
 * in the card stack under `/settings/account` (e.g. multi-session accounts).
 */
export type AccountCardProps = {
  className?: string
  children?: ReactNode
}

/**
 * Props passed to every plugin-contributed user-menu item. Rendered inside
 * `UserButton`'s dropdown (e.g. multi-session account switcher).
 */
export type UserMenuItemProps = {
  className?: string
}

/**
 * View component rendered by the `<Auth>` / `<Settings>` router when the
 * current path matches a plugin-contributed `viewPaths` entry.
 */
export type AuthPluginViewComponent = ComponentType<{
  className?: string
}>

/**
 * Default slot component shapes — the framework-agnostic baseline every UI
 * package accepts.
 *
 * Slots are arrays so a single plugin can contribute multiple components to
 * the same region (e.g. a twoFactor plugin could push TOTP, backup-code, and
 * trusted-device cards into `securityCards`).
 *
 * UI packages (heroui, shadcn, native) override these by passing a narrower
 * `TComponents` parameter to `AuthPlugin`, which lets them carry
 * package-specific slot prop shapes (e.g. heroui variant unions).
 */
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

/**
 * View components matching keys declared in `AuthPluginViewPaths`. The
 * `<Auth>` and `<Settings>` routers look up the current view in this merged
 * map and render the resolved component.
 */
export type AuthPluginViews = {
  auth?: Record<string, AuthPluginViewComponent>
  settings?: Record<string, AuthPluginViewComponent>
}

/**
 * UI-aware plugin definition.
 *
 * Extends the identity-only `CoreAuthPlugin` (`id`, `localization`) with
 * slot components and view/route contributions. Generic over `TComponents`
 * so UI packages can carry framework-specific slot prop shapes:
 *
 * ```ts
 * // heroui
 * import type { AuthPlugin as AuthPluginPrimitive } from "@better-auth-ui/react"
 *
 * export type AuthPlugin = AuthPluginPrimitive<HeroUiAuthPluginComponents>
 * ```
 *
 * @example Existing plugins
 * ```ts
 * // passkey
 * passkeyPlugin() satisfies AuthPlugin = {
 *   id: "passkey",
 *   localization: { passkey, addPasskey, passkeys, ... },
 *   authButtons: [PasskeyButton],
 *   securityCards: [Passkeys]
 * }
 *
 * // magic link
 * magicLinkPlugin() satisfies AuthPlugin = {
 *   id: "magicLink",
 *   localization: { magicLink, sendMagicLink, magicLinkSent, ... },
 *   authButtons: [MagicLinkButton],
 *   viewPaths: { auth: { magicLink: "magic-link" } },
 *   views: { auth: { magicLink: MagicLink } }
 * }
 *
 * // multi session
 * multiSessionPlugin() satisfies AuthPlugin = {
 *   id: "multiSession",
 *   localization: { switchAccount, addAccount, ... },
 *   accountCards: [ManageAccounts],
 *   userMenuItems: [SwitchAccountMenu]
 * }
 * ```
 */
export type AuthPlugin<TComponents = AuthPluginComponents> = CoreAuthPlugin &
  TComponents & {
    views?: AuthPluginViews
  }
