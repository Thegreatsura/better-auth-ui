import { useAuth, useAuthenticate } from "@better-auth-ui/react"
import type { SettingsView } from "@better-auth-ui/react/core"
import { cn, Tabs } from "@heroui/react"
import { type ComponentProps, useMemo } from "react"

import { AccountSettings } from "./account/account-settings"
import { SecuritySettings } from "./security/security-settings"

export type SettingsProps = {
  className?: string
  hideNav?: boolean
  path?: string
  view?: SettingsView
}

/**
 * Renders the settings UI and activates the appropriate settings view based on `view` or `path`.
 *
 * @param className - Additional CSS class names applied to the root container
 * @param path - Route path used to resolve which settings view to activate when `view` is not provided
 * @param view - Explicit settings view to activate, e.g. `"account"` or `"security"`
 * @param hideNav - When `true`, hide the navigation tabs
 * @returns A DOM tree containing the responsive settings tabs and the currently selected settings panel
 *
 * @throws Error if neither `view` nor `path` is provided
 */
export function Settings({
  className,
  hideNav,
  path,
  view,
  ...props
}: SettingsProps & ComponentProps<"div">) {
  const { basePaths, localization, viewPaths } = useAuth()
  useAuthenticate()

  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const settingsPathViews = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(viewPaths.settings).map(([k, v]) => [v, k])
      ) as Record<string, SettingsView>,
    [viewPaths.settings]
  )

  const currentView = view || (path ? settingsPathViews[path] : undefined)

  return (
    <Tabs
      className={cn(className)}
      orientation="horizontal"
      selectedKey={currentView}
      {...props}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label={localization.settings.settings}
          className="overflow-auto w-fit"
        >
          <Tabs.Tab
            id="account"
            href={`${basePaths.settings}/${viewPaths.settings.account}`}
          >
            {localization.settings.account}

            <Tabs.Indicator />
          </Tabs.Tab>

          <Tabs.Tab
            id="security"
            href={`${basePaths.settings}/${viewPaths.settings.security}`}
          >
            {localization.settings.security}

            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id="account" className="px-0">
        <AccountSettings />
      </Tabs.Panel>

      <Tabs.Panel id="security" className="px-0">
        <SecuritySettings />
      </Tabs.Panel>
    </Tabs>
  )
}
