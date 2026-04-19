import type { AuthConfig } from "@better-auth-ui/core"
import type { createAuthClient } from "better-auth/react"

/**
 * Type representing any auth client created with `createAuthClient`.
 *
 * Used for type flexibility when accepting auth clients that may have different
 * plugin configurations or feature sets.
 */
export type DefaultAuthClient = ReturnType<typeof createAuthClient>

/**
 * Type representing the default auth client with plugins enabled.
 *
 * This is the standard auth client type used throughout the React package
 * and includes all required plugins enabled.
 */

type ResolveAuthClient<T> = "AuthClient" extends keyof T
  ? T["AuthClient"]
  : DefaultAuthClient

/**
 * The resolved auth client type, either from user augmentation or the default.
 *
 * Users can override by augmenting core's `AuthConfig` with an `AuthClient`
 * slot:
 *
 * ```ts
 * declare module "@better-auth-ui/core" {
 *   interface AuthConfig {
 *     AuthClient: typeof authClient
 *   }
 * }
 * ```
 */
export type AuthClient = ResolveAuthClient<AuthConfig>
