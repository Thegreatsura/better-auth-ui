"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { Monitor, Moon, Sun } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { themePlugin } from "@/lib/theme/theme-plugin"

/**
 * Theme toggle dropdown item used inside `UserButton`. Callers are responsible
 * for ensuring theming is configured before rendering this component.
 */
export function ThemeToggleItem() {
  const { useTheme, localization } = useAuthPlugin(themePlugin)
  const { theme, setTheme, themes = [] } = useTheme()

  return (
    <div
      className="py-1.5 px-2 flex items-center justify-between cursor-default hover:bg-transparent!"
      onSelect={(e) => e.preventDefault()}
    >
      <span className="text-sm">{localization.theme}</span>

      <Tabs value={theme} onValueChange={setTheme}>
        <TabsList className="h-6!">
          {themes.includes("system") && (
            <TabsTrigger
              value="system"
              className="size-5 p-0"
              aria-label={localization.system}
            >
              <Monitor className="size-3" />
            </TabsTrigger>
          )}
          {themes.includes("light") && (
            <TabsTrigger
              value="light"
              className="size-5 p-0"
              aria-label={localization.light}
            >
              <Sun className="size-3" />
            </TabsTrigger>
          )}
          {themes.includes("dark") && (
            <TabsTrigger
              value="dark"
              className="size-5 p-0"
              aria-label={localization.dark}
            >
              <Moon className="size-3" />
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  )
}
