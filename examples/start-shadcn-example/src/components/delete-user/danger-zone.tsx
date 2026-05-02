"use client"

import { useAuth } from "@better-auth-ui/react"

import { cn } from "@/lib/utils"
import { DeleteUser } from "./delete-user"

export type DangerZoneProps = {
  className?: string
}

/**
 * Renders the danger zone heading and {@link DeleteUser}.
 * Registered as a `securityCard` by `deleteUserPlugin()`; gate by registering the plugin.
 */
export function DangerZone({ className }: DangerZoneProps) {
  const { localization } = useAuth()

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <h2 className="text-sm font-semibold mb-3">
        {localization.settings.dangerZone}
      </h2>

      <DeleteUser />
    </div>
  )
}
