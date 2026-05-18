import type { SettingsView } from "@better-auth-ui/core"
import {
  type SettingsTab,
  useAuth,
  useAuthenticate
} from "@better-auth-ui/react"
import { Person, Shield } from "@gravity-ui/icons"
import { type CardProps, cn, Tabs } from "@heroui/react"
import {
  type ComponentProps,
  type ComponentType,
  createElement,
  useMemo
} from "react"
import { AccountSettings } from "./account/account-settings"
import { SecuritySettings } from "./security/security-settings"

export type SettingsProps = {
  className?: string
  hideNav?: boolean
  path?: string
  variant?: CardProps["variant"]
  /** @remarks `SettingsView` */
  view?: SettingsView
}

/**
 * Renders the settings UI and activates the appropriate settings view based on `view` or `path`.
 *
 * @param className - Additional CSS class names applied to the root container
 * @param path - Route path used to resolve which settings view to activate when `view` is not provided
 * @param view - Explicit settings view to activate, e.g. `"account"` or `"security"`
 * @param hideNav - When `true`, hide the navigation tabs
 * @param variant - Card variant forwarded to each settings section card
 * @returns A DOM tree containing the responsive settings tabs and the currently selected settings panel
 *
 * @throws Error if neither `view` nor `path` is provided
 */
export function Settings({
  className,
  hideNav,
  path,
  variant,
  view,
  ...props
}: SettingsProps & ComponentProps<"div">) {
  const { authClient, basePaths, localization, viewPaths, plugins } = useAuth()
  useAuthenticate(authClient)

  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  // Built-ins first, then plugin segments (same idea as `<Auth>` resolving
  // `magicLink` from `plugin.viewPaths.auth` — not merged on `AuthProvider`).
  const settingsPathViews = useMemo(() => {
    const map: Record<string, string> = {}
    for (const [viewKey, segment] of Object.entries(viewPaths.settings)) {
      map[segment] = viewKey
    }
    for (const plugin of plugins) {
      const contributed = plugin.viewPaths?.settings
      if (!contributed) continue
      for (const [viewKey, segment] of Object.entries(contributed)) {
        map[segment] = viewKey
      }
    }
    return map as Record<string, SettingsView>
  }, [viewPaths.settings, plugins])

  const currentView = view || (path ? settingsPathViews[path] : undefined)

  const settingsTabs = useMemo((): SettingsTab[] => {
    const tabs: SettingsTab[] = []
    for (const plugin of plugins) {
      if (plugin.settingsTabs) {
        tabs.push(...plugin.settingsTabs)
      }
    }
    return tabs
  }, [plugins])

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
          className="max-w-fit overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <Tabs.Tab
            id="account"
            href={`${basePaths.settings}/${viewPaths.settings.account}`}
            className="gap-2"
            onPress={(e) =>
              e.target.scrollIntoView({ behavior: "smooth", inline: "center" })
            }
          >
            <Person className="text-muted" />

            {localization.settings.account}

            <Tabs.Indicator />
          </Tabs.Tab>

          <Tabs.Tab
            id="security"
            href={`${basePaths.settings}/${viewPaths.settings.security}`}
            className="gap-2"
            onPress={(e) =>
              e.target.scrollIntoView({ behavior: "smooth", inline: "center" })
            }
          >
            <Shield className="text-muted" />

            {localization.settings.security}

            <Tabs.Indicator />
          </Tabs.Tab>

          {settingsTabs.map((tab) => {
            const segment =
              plugins.find((p) =>
                p.settingsTabs?.some((t) => t.view === tab.view)
              )?.viewPaths?.settings?.[tab.view] ?? tab.view

            return (
              <Tabs.Tab
                key={tab.view}
                id={tab.view}
                href={`${basePaths.settings}/${segment}`}
                className="gap-2"
                onPress={(e) =>
                  e.target.scrollIntoView({
                    behavior: "smooth",
                    inline: "center"
                  })
                }
              >
                {tab.label}

                <Tabs.Indicator />
              </Tabs.Tab>
            )
          })}
        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id="account" className="px-0">
        <AccountSettings variant={variant} />
      </Tabs.Panel>

      <Tabs.Panel id="security" className="px-0">
        <SecuritySettings variant={variant} />
      </Tabs.Panel>

      {settingsTabs.map((tab) => (
        <Tabs.Panel key={tab.view} id={tab.view} className="px-0">
          {tab.component && typeof tab.component === "function"
            ? createElement(
                tab.component as ComponentType<{
                  variant?: CardProps["variant"]
                }>,
                { variant }
              )
            : null}
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
