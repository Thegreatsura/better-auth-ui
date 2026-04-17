import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/core"
import type { ComponentType, PropsWithChildren } from "react"
import type { AnyAuthClient, AuthClient } from "./auth-client"

/**
 * Extends the base AuthConfig with React-specific requirements including
 * an authClient instance and a Link component for navigation.
 *
 * Users can augment this interface to provide their own auth client type:
 * @example
 * ```ts
 * declare module "@better-auth-ui/react" {
 *   interface AuthConfig {
 *     AuthClient: typeof authClient
 *   }
 * }
 * ```
 */
export interface AuthConfig extends BaseAuthConfig {
  authClient: AuthClient
  /**
   * React component for rendering links
   * @remarks `LinkComponent`
   */
  Link: ComponentType<
    PropsWithChildren<{ className?: string; href: string; to?: string }>
  >
}

// biome-ignore lint/suspicious/noExplicitAny: required for generic utility type
type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

/**
 * Partial AuthConfig with any Better Auth client instance.
 */
export type AnyAuthConfig = DeepPartial<Omit<AuthConfig, "authClient">> & {
  /**
   * Better Auth client instance
   * @remarks `AuthClient`
   */
  authClient?: AnyAuthClient
}
