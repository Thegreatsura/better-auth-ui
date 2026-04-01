import { useAuth } from "@better-auth-ui/react"
import { type CardProps, cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { DeleteUser } from "./delete-user"

export type DangerZoneProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Renders the danger zone heading and {@link DeleteUser}.
 * Gate with `deleteUser.enabled` at the call site (e.g. {@link SecuritySettings}).
 */
export function DangerZone({
  className,
  variant,
  ...props
}: DangerZoneProps & ComponentProps<"div">) {
  const { localization } = useAuth()

  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {localization.settings.dangerZone}
      </h2>

      <DeleteUser variant={variant} />
    </div>
  )
}
