import { useAuth, useAuthPlugin } from "@better-auth-ui/react"
import { Persons } from "@gravity-ui/icons"
import { Dropdown, Label } from "@heroui/react"

import { multiSessionPlugin } from "../../lib/multi-session/multi-session-plugin"

import { SwitchAccountMenu } from "./switch-account-menu"

export type SwitchAccountMenuItemProps = {
  className?: string
}

/**
 * Render a dropdown menu item for switching between multiple authenticated sessions.
 *
 * This component renders as a submenu trigger that opens the switch account menu.
 * It should be rendered inside a Dropdown.Menu.
 *
 * @param className - Optional additional CSS class names
 * @returns The switch account menu item as a JSX element
 */
export function SwitchAccountMenuItem({
  className
}: SwitchAccountMenuItemProps) {
  const { localization: multiSessionLocalization } = useAuthPlugin(multiSessionPlugin)

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item
        className={className}
        textValue={multiSessionLocalization.switchAccount}
      >
        <Persons className="text-muted" />

        <Label>{multiSessionLocalization.switchAccount}</Label>

        <Dropdown.SubmenuIndicator />
      </Dropdown.Item>

      <Dropdown.Popover className="min-w-40 md:min-w-56 max-w-[48svw]">
        <SwitchAccountMenu />
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  )
}