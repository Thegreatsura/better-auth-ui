import type { SocialProvider } from "better-auth/social-providers"

import { type BasePaths, basePaths } from "../lib/base-paths"
import { type Localization, localization } from "../lib/localization"
import { resizeAvatar } from "../lib/utils"
import { type ViewPaths, viewPaths } from "../lib/view-paths"
import type { AppearanceConfig } from "./appearance-config"
import type { AvatarConfig } from "./avatar-config"
import type { DeleteUserConfig } from "./delete-user-config"
import type { EmailAndPasswordConfig } from "./email-and-password-config"

/**
 * Core authentication configuration interface.
 *
 * Defines the base structure for authentication settings including paths,
 * providers, navigation functions, and feature flags.
 */
export interface AuthConfig {
  /**
   * Appearance/theme configuration
   * @remarks `AppearanceConfig`
   * @default { themes: ["system", "light", "dark"] }
   */
  appearance: AppearanceConfig
  /**
   * Avatar upload, optimization, and deletion configuration.
   * @remarks `AvatarConfig`
   * @default { enabled: true, resize: resizeAvatar, size: 256, extension: "png" }
   */
  avatar: AvatarConfig
  /**
   * Base paths for different application sections
   * @remarks `BasePaths`
   */
  basePaths: BasePaths
  /**
   * Base URL for API endpoints (optional)
   * @default ""
   */
  baseURL: string
  /**
   * Allow users to delete their account
   * @remarks `DeleteUserConfig`
   */
  deleteUser?: DeleteUserConfig
  /**
   * Email and password authentication configuration
   * @remarks `EmailAndPasswordConfig`
   */
  emailAndPassword: EmailAndPasswordConfig
  /**
   * Localization strings for UI components
   * @remarks `Localization`
   */
  localization: Localization
  /** Whether magic link (passwordless) authentication is enabled */
  magicLink?: boolean
  /** Whether multi-session support is enabled */
  multiSession?: boolean
  /**
   * Default redirect path after successful authentication
   * @default "/"
   */
  redirectTo: string
  /**
   * List of enabled social authentication providers
   * @remarks `SocialProvider[]`
   */
  socialProviders?: SocialProvider[]
  /**
   * View path mappings for different authentication views
   * @remarks `ViewPaths`
   */
  viewPaths: ViewPaths
  /**
   * Function to navigate to a new path
   * @param options - Navigation options with href and optional replace flag
   * @default window.location.href = href (or window.location.replace if replace: true)
   * @example
   * // TanStack Router
   * navigate={navigate}
   * // Next.js
   * navigate={({href, replace}) => replace ? router.replace(href) : router.push(href)}
   */
  navigate: (options: { to: string; replace?: boolean }) => void
}

export const defaultAuthConfig: AuthConfig = {
  appearance: {
    themes: ["system", "light", "dark"]
  },
  avatar: {
    enabled: true,
    resize: resizeAvatar,
    size: 256,
    extension: "png"
  },
  basePaths,
  baseURL: "",
  emailAndPassword: {
    enabled: true,
    forgotPassword: true,
    rememberMe: false,
    minPasswordLength: 8,
    maxPasswordLength: 128
  },
  redirectTo: "/",
  viewPaths,
  localization,
  navigate: ({ to, replace }) => {
    if (replace) {
      window.location.replace(to)
    } else {
      window.location.href = to
    }
  }
}
