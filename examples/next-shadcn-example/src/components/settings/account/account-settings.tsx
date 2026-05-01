"use client"

import { useAuth } from "@better-auth-ui/react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Appearance } from "./appearance"
import { ChangeEmail } from "./change-email"
import { UserProfile } from "./user-profile"

export type AccountSettingsProps = {
  className?: string
}

/**
 * Renders the account settings layout.
 *
 * Uses `emailAndPassword`, `plugins`, and `appearance.setTheme` from `useAuth()`
 * to conditionally show sections:
 * - `UserProfile` always renders.
 * - `ChangeEmail` renders when `emailAndPassword?.enabled` is truthy or the
 *   `magicLink` plugin is registered.
 * - `Appearance` renders when `setTheme` is truthy.
 * - Plugin-contributed account cards are rendered via the plugins array.
 */
export function AccountSettings({
  className,
  ...props
}: AccountSettingsProps & ComponentProps<"div">) {
  const {
    emailAndPassword,
    plugins,
    appearance: { setTheme }
  } = useAuth()

  const hasMagicLink = plugins.some((plugin) => plugin.id === "magicLink")

  return (
    <div
      className={cn("flex w-full flex-col gap-4 md:gap-6", className)}
      {...props}
    >
      <UserProfile />
      {(emailAndPassword?.enabled || hasMagicLink) && <ChangeEmail />}
      {setTheme && <Appearance />}
      {plugins.flatMap(
        (plugin) =>
          plugin.accountCards?.map((Card, index) => (
            <Card key={`${plugin.id}-${index.toString()}`} />
          )) ?? []
      )}
    </div>
  )
}
