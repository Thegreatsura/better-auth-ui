import { useAuth, useSession } from "@better-auth-ui/react"
import {
  ArrowRightFromSquare,
  ArrowRightToSquare,
  ChevronsExpandVertical,
  Gear,
  PersonPlus
} from "@gravity-ui/icons"
import {
  Button,
  type ButtonProps,
  cn,
  Dropdown,
  type DropdownPopoverProps,
  Label,
  Separator
} from "@heroui/react"

import { UserAvatar } from "./user-avatar"
import { UserView } from "./user-view"

export type UserButtonProps = {
  className?: string
  size?: "default" | "icon"
  /**
   * The placement of the element with respect to its anchor element.
   * @default "bottom"
   */
  placement?: DropdownPopoverProps["placement"]
  variant?: ButtonProps["variant"]
}

/**
 * Render a user account dropdown button that shows account actions.
 *
 * @param className - Additional CSS classes applied to the trigger element
 * @param placement - Dropdown popover placement (e.g., "bottom", "top-start", "bottom-end")
 * @param size - "icon" renders an avatar-only trigger; "default" renders a button with label and chevron
 * @param variant - Button visual variant passed to the underlying Button component
 * @returns The user button and its dropdown menu as a JSX element
 */
export function UserButton({
  className,
  placement = "bottom",
  size = "default",
  variant = "ghost"
}: UserButtonProps) {
  const { authClient, basePaths, viewPaths, localization, plugins } = useAuth()

  const { data: session, isPending: sessionPending } = useSession(authClient)

  const userMenuItems = plugins.flatMap(
    (plugin) =>
      plugin.userMenuItems?.map((Item, index) => (
        <Item key={`${plugin.id}-${index.toString()}`} />
      )) ?? []
  )
  return (
    <Dropdown>
      {size === "icon" ? (
        <Dropdown.Trigger className={cn("rounded-full", className)}>
          <UserAvatar />
        </Dropdown.Trigger>
      ) : (
        <Button
          variant={variant}
          className={cn(
            "h-auto font-normal justify-start px-3 py-2 text-left",
            className
          )}
        >
          {session || sessionPending ? (
            <UserView isPending={sessionPending} />
          ) : (
            <>
              <UserAvatar />

              <p className="text-sm font-medium">{localization.auth.account}</p>
            </>
          )}

          <ChevronsExpandVertical className="ml-auto size-3.5" />
        </Button>
      )}

      <Dropdown.Popover
        placement={placement}
        className="min-w-40 md:min-w-56 max-w-[48svw]"
      >
        {session && (
          <div className="px-3 pt-3 pb-1">
            <UserView />
          </div>
        )}

        <Dropdown.Menu>
          {session ? (
            <>
              <Dropdown.Item
                textValue={localization.settings.settings}
                href={`${basePaths.settings}/${viewPaths.settings.account}`}
              >
                <Gear className="text-muted" />

                <Label>{localization.settings.settings}</Label>
              </Dropdown.Item>

              {userMenuItems}

              <Separator />

              <Dropdown.Item
                textValue={localization.auth.signOut}
                href={`${basePaths.auth}/${viewPaths.auth.signOut}`}
              >
                <ArrowRightFromSquare className="text-muted" />

                <Label>{localization.auth.signOut}</Label>
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item
                textValue={localization.auth.signIn}
                href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              >
                <ArrowRightToSquare className="text-muted" />

                <Label>{localization.auth.signIn}</Label>
              </Dropdown.Item>

              <Dropdown.Item
                textValue={localization.auth.signUp}
                href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
              >
                <PersonPlus className="text-muted" />

                <Label>{localization.auth.signUp}</Label>
              </Dropdown.Item>

              {userMenuItems}
            </>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
