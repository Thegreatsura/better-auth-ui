import { useAuthPlugin } from "@better-auth-ui/react"
import { Persons } from "@gravity-ui/icons"
import { Dropdown, Label } from "@heroui/react"

import { multiSessionPlugin } from "../../lib/multi-session/multi-session-plugin"

import { SwitchAccountSubmenuContent } from "./switch-account-submenu-content"

export type SwitchAccountSubmenuProps = {
  className?: string
}

/**
 * Render a dropdown submenu for switching between multiple authenticated sessions.
 *
 * This component renders as a submenu trigger that opens the switch account menu.
 * It should be rendered inside a Dropdown.Menu.
 *
 * @param className - Optional additional CSS class names
 * @returns The switch account submenu as a JSX element
 */
export function SwitchAccountSubmenu({ className }: SwitchAccountSubmenuProps) {
  const { localization: multiSessionLocalization } =
    useAuthPlugin(multiSessionPlugin)

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
        <SwitchAccountSubmenuContent />
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  )
}
