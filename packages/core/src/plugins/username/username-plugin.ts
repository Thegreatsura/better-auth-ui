import { createAuthPlugin } from "../../lib/create-auth-plugin"
// Side-effect import so this file participates in declaration merging on the
// same module instance that external consumers reach via `@better-auth-ui/core`.
import type {} from "../../lib/view-paths"
import {
  type UsernameLocalization,
  usernameLocalization
} from "./username-localization"

declare module "../../lib/view-paths" {
  /** Widens `AuthViewPaths` by adding the `"signInUsername"` path when this plugin is imported. */
  interface AuthViewPaths {
    /** @default "sign-in-username" */
    signInUsername?: string
  }
}

export type UsernamePluginOptions = {
  /**
   * Whether to use displayUsername for the visible username field in the profile.
   */
  displayUsername?: boolean
  /**
   * Whether to check username availability on sign-up and user profile.
   */
  isUsernameAvailable?: boolean
  /**
   * Minimum allowed username length.
   * @default 3
   */
  minUsernameLength?: number
  /**
   * Maximum allowed username length.
   * @default 30
   */
  maxUsernameLength?: number
  /**
   * Override the plugin's default localization strings.
   * @remarks `UsernameLocalization`
   */
  localization?: Partial<UsernameLocalization>
  /**
   * URL segment for the sign-in-username view.
   * @remarks `string`
   * @default "sign-in-username"
   */
  path?: string
}

/** Fields contributed by the username plugin. */
const usernameAdditionalFields = [
  {
    name: "username",
    type: "string" as const,
    label: "Username",
    inputType: "input" as const
  },
  {
    name: "displayUsername",
    type: "string" as const,
    label: "Display Username",
    inputType: "input" as const
  }
]

export const usernamePlugin = createAuthPlugin(
  "username",
  (
    options: UsernamePluginOptions = {
      maxUsernameLength: 30,
      minUsernameLength: 3
    }
  ) => ({
    ...options,
    localization: { ...usernameLocalization, ...options.localization },
    viewPaths: {
      auth: { signInUsername: options.path ?? "sign-in-username" }
    },
    additionalFields: usernameAdditionalFields
  })
)
