import type {
  AuthView,
  AuthPlugin as CoreAuthPlugin
} from "@better-auth-ui/core"
import type { ComponentType, ReactNode } from "react"

export type { AuthPluginViewPaths } from "@better-auth-ui/core"

/**
 * Props passed to every plugin-contributed auth button (e.g. passkey, magic
 * link). Rendered alongside the submit button in sign-in / sign-up /
 * forgot-password / magic-link forms.
 */
export type AuthButtonProps = {
  className?: string
  children?: ReactNode
  isPending?: boolean
  /**
   * The auth view currently being rendered. Plugin buttons can use this to
   * context-switch (e.g. `MagicLinkButton` renders a "back to sign-in"
   * toggle when `view === "magicLink"`).
   */
  view?: AuthView
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
 *
 * Props are intentionally loose — UI packages (heroui, shadcn, native) pass
 * framework-specific router props (e.g. `socialLayout`, `variant`) to the
 * resolved view, and each plugin declares its own narrower prop shape at the
 * component definition site.
 */
// biome-ignore lint/suspicious/noExplicitAny: plugin views define their own prop shapes
export type AuthPluginViewComponent = ComponentType<any>

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
 *
 * Registering a component under a built-in key (e.g. `auth.signIn`) **always**
 * replaces the built-in view — this is a hard override. For conditional
 * replacements that only kick in when a built-in flow is unavailable (e.g.
 * magic link standing in for sign-in when `emailAndPassword.enabled === false`),
 * use `fallbackViews` instead.
 */
export type AuthPluginViews = {
  auth?: Record<string, AuthPluginViewComponent>
  settings?: Record<string, AuthPluginViewComponent>
}

/**
 * Conditional view replacements a plugin offers when a built-in view isn't
 * viable under the current config. Unlike `views`, which always wins,
 * `fallbackViews` only takes effect when the built-in flow is disabled.
 *
 * The `<Auth>` router checks each key's condition and, if met, renders the
 * fallback in place of the built-in view.
 */
export type AuthPluginFallbackViews = {
  auth?: {
    /**
     * Rendered at `/auth/sign-in` when
     * `AuthConfig.emailAndPassword.enabled === false` and this plugin is
     * registered. Used to replace the password form with an alternative
     * primary sign-in flow (e.g. magic link).
     */
    signIn?: AuthPluginViewComponent
  }
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
 *   views: { auth: { magicLink: MagicLink } },
 *   // Conditional, not an override: when `emailAndPassword.enabled === false`
 *   // the `<Auth>` router renders this at `/auth/sign-in` instead of the
 *   // disabled password form. With password auth on, the built-in `SignIn`
 *   // still wins.
 *   fallbackViews: { auth: { signIn: MagicLink } }
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
    fallbackViews?: AuthPluginFallbackViews
  }
