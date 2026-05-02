"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useRef } from "react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { themePlugin } from "@/lib/theme/theme-plugin"

/**
 * Theme toggle dropdown item used inside `UserButton`. Callers are responsible
 * for ensuring theming is configured before rendering this component.
 */
export function ThemeToggleItem() {
  const { useTheme, localization } = useAuthPlugin(themePlugin)
  const { theme, setTheme, themes = [] } = useTheme()
  const tabsListRef = useRef<HTMLDivElement>(null)

  // The TabsTriggers aren't part of the menu's roving focus group, so
  // arrow-key navigation can't reach them on its own. When the wrapper
  // menu item receives focus, we immediately delegate focus to the active
  // TabsTrigger so the user can switch themes with the arrow keys.
  const focusActiveTab = () => {
    const activeTab = tabsListRef.current?.querySelector<HTMLElement>(
      '[role="tab"][data-state="active"]'
    )
    activeTab?.focus()
  }

  // Move keyboard focus back to the next/previous sibling menu item when
  // the user presses Up/Down while focused on a TabsTrigger.
  const handleTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return

    const target = event.target as HTMLElement
    if (target.getAttribute("role") !== "tab") return

    const wrapper = target.closest<HTMLElement>('[role="menuitem"]')
    const content = wrapper?.closest<HTMLElement>("[data-radix-menu-content]")
    if (!wrapper || !content) return

    const items = Array.from(
      content.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      )
    )
    const currentIndex = items.indexOf(wrapper)
    const nextIndex =
      event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1
    const next = items[nextIndex]
    if (!next) return

    event.preventDefault()
    event.stopPropagation()
    next.focus()
  }

  return (
    <DropdownMenuItem
      asChild
      onSelect={(e) => e.preventDefault()}
      onFocus={(e) => {
        // Only delegate when the wrapper itself receives focus (not when
        // a focus event bubbles up from the inner TabsTrigger).
        if (e.target === e.currentTarget) focusActiveTab()
      }}
      className="justify-between"
    >
      <div>
        <span>{localization.theme}</span>

        <Tabs
          value={theme}
          onValueChange={setTheme}
          onKeyDown={handleTabsKeyDown}
        >
          <TabsList ref={tabsListRef} className="h-6!">
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
    </DropdownMenuItem>
  )
}
