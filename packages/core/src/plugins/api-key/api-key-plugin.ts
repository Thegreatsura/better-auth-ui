import { createAuthPlugin } from "../../lib/create-auth-plugin"
import {
  type ApiKeyLocalization,
  apiKeyLocalization
} from "./api-key-localization"

export type ApiKeyPluginOptions = {
  /**
   * Override the plugin's default localization strings.
   * @remarks `ApiKeyLocalization`
   */
  localization?: Partial<ApiKeyLocalization>
}

export const apiKeyPlugin = createAuthPlugin(
  "apiKey",
  (options: ApiKeyPluginOptions = {}) => ({
    localization: { ...apiKeyLocalization, ...options.localization }
  })
)
