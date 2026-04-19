import type { AuthPlugin as CoreAuthPlugin } from "@better-auth-ui/core"
import type { ComponentType, ReactNode } from "react"

/**
 * Default slot component prop shapes — framework-agnostic baseline every
 * UI package must accept (`className`, `children`, `isPending`, ...).
 *
 * UI packages (heroui, shadcn, etc.) define their own `AuthPlugin` type
 * by passing a narrower `TComponents` parameter to `AuthPlugin` below.
 */
export type AuthPluginComponents = {
  /** Rendered alongside the submit button in sign-in / magic-link forms. */
  AuthButton?: ComponentType<{
    className?: string
    children?: ReactNode
    isPending?: boolean
  }>
  /** Rendered as a card inside security settings. */
  SecurityCard?: ComponentType<{
    className?: string
    children?: ReactNode
  }>
}

/**
 * The UI-aware plugin type.
 *
 * Generic over `TComponents` so UI packages can define their own
 * `AuthPlugin` alias that carries package-specific component prop types:
 *
 * ```ts
 * // heroui
 * import type { AuthPlugin as AuthPluginPrimitive } from "@better-auth-ui/react"
 * export type AuthPlugin = AuthPluginPrimitive<HeroUiAuthPluginComponents>
 * ```
 */
export type AuthPlugin<TComponents = AuthPluginComponents> = CoreAuthPlugin &
  TComponents
