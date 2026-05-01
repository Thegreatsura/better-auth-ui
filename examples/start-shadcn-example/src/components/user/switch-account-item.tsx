"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { UsersRound } from "lucide-react"

import {
  DropdownMenuSub,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { multiSessionPlugin } from "@/lib/multi-session/multi-session-plugin"
import { SwitchAccountSubmenu } from "./switch-account-submenu"

export type SwitchAccountItemProps = {
  className?: string
}

/**
 * Render a submenu trigger for switching between multiple authenticated sessions.
 *
 * This component renders as a dropdown menu item that opens a submenu containing
 * the switch account menu. It should be rendered inside the UserButton dropdown
 * as a userMenuItem from the multiSessionPlugin.
 *
 * @param className - Optional additional CSS class names
 * @returns The switch account menu item as a JSX element
 */
export function SwitchAccountItem({ className }: SwitchAccountItemProps) {
  const { localization: multiSessionLocalization } =
    useAuthPlugin(multiSessionPlugin)

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={className}>
        <UsersRound className="text-muted-foreground" />

        {multiSessionLocalization.switchAccount}
      </DropdownMenuSubTrigger>

      <SwitchAccountSubmenu />
    </DropdownMenuSub>
  )
}
