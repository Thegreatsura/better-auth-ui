import type { AuthPlugin as AuthPluginPrimitive } from "@better-auth-ui/react"
import type { ButtonProps, CardProps } from "@heroui/react"
import type { ComponentType, ReactNode } from "react"

/**
 * Heroui-specific slot component prop shapes. Narrows the framework-
 * agnostic defaults from `@better-auth-ui/react` with heroui primitives
 * (variant unions, etc.).
 */
export type HeroUiAuthPluginComponents = {
  /** Rendered alongside the submit button in sign-in / magic-link forms. */
  AuthButton?: ComponentType<{
    className?: string
    children?: ReactNode
    isPending?: boolean
    variant?: ButtonProps["variant"]
  }>
  /** Rendered as a card inside security settings. */
  SecurityCard?: ComponentType<{
    className?: string
    children?: ReactNode
    variant?: CardProps["variant"]
  }>
}

/**
 * Heroui plugin type — carries heroui-specific slot component shapes.
 * Plugin authors import this from `@better-auth-ui/heroui`.
 */
export type AuthPlugin = AuthPluginPrimitive<HeroUiAuthPluginComponents>
