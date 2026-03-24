import {
  useAuth,
  useRevokeMultiSession,
  useSession,
  useSetActiveSession
} from "@better-auth-ui/react"
import {
  ArrowRightArrowLeft,
  ArrowRightFromSquare,
  Ellipsis
} from "@gravity-ui/icons"
import { Button, Dropdown, toast } from "@heroui/react"
import type { Session, User } from "better-auth"

import { UserView } from "../../user/user-view"

export type DeviceSession = {
  session: Session
  user: User
}

export type ManageAccountProps = {
  deviceSession?: DeviceSession | null
  isPending?: boolean
}

/**
 * Render a single account row with user info and a dropdown for switch/sign-out actions.
 *
 * Shows the user's avatar and info. A three-dot menu provides options to
 * switch account (for non-active sessions) and sign out.
 *
 * @param deviceSession - The device session object containing session and user data
 * @returns A JSX element containing the account row
 */
export function ManageAccount({
  deviceSession,
  isPending
}: ManageAccountProps) {
  const { localization } = useAuth()
  const { data: sessionData } = useSession()

  const { mutate: setActiveSession, isPending: isSwitching } =
    useSetActiveSession({
      onError: (error) => toast.danger(error.error?.message || error.message)
    })

  const { mutate: revokeSession, isPending: isRevoking } =
    useRevokeMultiSession({
      onError: (error) => toast.danger(error.error?.message || error.message),
      onSuccess: () => toast.success(localization.settings.revokeSessionSuccess)
    })

  const isActive = deviceSession?.session.userId === sessionData?.session.userId
  const isBusy = isSwitching || isRevoking

  return (
    <div className="flex items-center justify-between gap-3">
      <UserView user={deviceSession?.user} isPending={isPending} size="md" />

      {deviceSession && (
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              className="ml-auto shrink-0"
              size="sm"
              isDisabled={isBusy}
            >
              <Ellipsis />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu>
              {!isActive && (
                <Dropdown.Item
                  textValue={localization.auth.switchAccount}
                  onAction={() =>
                    setActiveSession({
                      sessionToken: deviceSession.session.token
                    })
                  }
                >
                  <ArrowRightArrowLeft className="text-muted" />
                  {localization.auth.switchAccount}
                </Dropdown.Item>
              )}

              <Dropdown.Item
                textValue={localization.auth.signOut}
                onAction={() =>
                  revokeSession({
                    sessionToken: deviceSession.session.token
                  })
                }
              >
                <ArrowRightFromSquare className="text-muted" />
                {localization.auth.signOut}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      )}
    </div>
  )
}
