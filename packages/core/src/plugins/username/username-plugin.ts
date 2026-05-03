import { createAuthPlugin } from "../../lib/create-auth-plugin"
import {
  type UsernameLocalization,
  usernameLocalization
} from "./username-localization"

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
}

export const usernamePlugin = createAuthPlugin(
  "username",
  (
    options: UsernamePluginOptions = {
      maxUsernameLength: 30,
      minUsernameLength: 3
    }
  ) => {
    const localization = { ...usernameLocalization, ...options.localization }

    return {
      ...options,
      localization,
      additionalFields: [
        {
          name: "username",
          type: "string" as const,
          label: localization.username,
          placeholder: localization.usernamePlaceholder,
          inputType: "input" as const,
          signUp: "above" as const
        },
        ...(options.displayUsername
          ? [
              {
                name: "displayUsername",
                type: "string" as const,
                label: localization.displayUsername,
                placeholder: localization.displayUsernamePlaceholder,
                inputType: "input" as const,
                signUp: "above" as const
              }
            ]
          : [])
      ]
    }
  }
)
