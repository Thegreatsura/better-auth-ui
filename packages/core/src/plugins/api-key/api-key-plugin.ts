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
  /**
   * Enable organization-owned API keys.
   *
   * When `true`, the plugin contributes an organization-scoped API keys card
   * to `<OrganizationSettings />`, and list/create/delete operations made on
   * behalf of an organization send `configId: "organization"`.
   *
   * Requires a matching server-side `apiKey` config entry with
   * `configId: "organization"` and `references: "organization"`:
   *
   * ```ts
   * apiKey([
   *   { configId: "default", references: "user" },
   *   { configId: "organization", references: "organization" }
   * ])
   * ```
   *
   * @default false
   */
  organization?: boolean
}

export const apiKeyPlugin = createAuthPlugin(
  "apiKey",
  (options: ApiKeyPluginOptions = {}) => ({
    localization: { ...apiKeyLocalization, ...options.localization },
    organization: options.organization ?? false
  })
)
