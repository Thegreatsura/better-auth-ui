import { useAuthPlugin } from "@better-auth-ui/react"
import { Display, Moon, Sun } from "@gravity-ui/icons"
import { Dropdown, Label, Tabs } from "@heroui/react"

import { themePlugin } from "../../lib/theme/theme-plugin"

/**
 * Theme toggle dropdown item used inside `UserButton`. Callers are responsible
 * for ensuring theming is configured before rendering this component.
 */
export function ThemeToggleItem() {
  const { useTheme, localization } = useAuthPlugin(themePlugin)
  const { theme, setTheme, themes = [] } = useTheme()

  return (
    <Dropdown.Item className="py-1 pe-2">
      <Label>{localization.theme}</Label>

      <Tabs
        className="ml-auto"
        selectedKey={theme}
        onSelectionChange={(key) => setTheme(key as string)}
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label={localization.theme}
            className="*:h-5 *:w-5 *:p-0"
          >
            {themes.includes("system") && (
              <Tabs.Tab id="system" aria-label={localization.system}>
                <Display className="size-3" />

                <Tabs.Indicator />
              </Tabs.Tab>
            )}

            {themes.includes("light") && (
              <Tabs.Tab id="light" aria-label={localization.light}>
                <Sun className="size-3" />

                <Tabs.Indicator />
              </Tabs.Tab>
            )}

            {themes.includes("dark") && (
              <Tabs.Tab id="dark" aria-label={localization.dark}>
                <Moon className="size-3" />

                <Tabs.Indicator />
              </Tabs.Tab>
            )}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </Dropdown.Item>
  )
}
