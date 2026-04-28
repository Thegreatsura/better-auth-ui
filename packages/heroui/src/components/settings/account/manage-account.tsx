import {
  type MultiSessionAuthClient,
  useAuth,
  useRevokeMultiSession,
  useSetActiveSession,
  useUser
} from "@better-auth-ui/react"
import {
  ArrowRightArrowLeft,
  ArrowRightFromSquare,
  Ellipsis
} from "@gravity-ui/icons"
import { Button, Dropdown, Spinner, toast } from "@heroui/react"
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
  const { authClient, localization } = useAuth()
  const { data: user } = useUser(authClient)

  const { mutate: setActiveSession, isPending: isSwitching } =
    useSetActiveSession(authClient as MultiSessionAuthClient, {
      onSuccess: () => window.scrollTo({ top: 0 })
    })

  const { mutate: revokeSession, isPending: isRevoking } =
    useRevokeMultiSession(authClient as MultiSessionAuthClient, {
      onSuccess: () => toast.success(localization.settings.revokeSessionSuccess)
    })

  const isActive = deviceSession?.session.userId === user?.id
  const isBusy = isSwitching || isRevoking

  return (
    <div className="flex items-center justify-between gap-3">
      <UserView user={deviceSession?.user} isPending={isPending} size="md" />

      {deviceSession && isActive && (
        <Button
          className="shrink-0"
          variant="outline"
          size="sm"
          onPress={() =>
            revokeSession({ sessionToken: deviceSession.session.token })
          }
          isDisabled={isBusy}
        >
          {isRevoking ? (
            <Spinner color="current" size="sm" />
          ) : (
            <ArrowRightFromSquare />
          )}
          {localization.auth.signOut}
        </Button>
      )}

      {deviceSession && !isActive && (
        <Dropdown>
          <Button
            isIconOnly
            variant="ghost"
            className="shrink-0"
            size="sm"
            isDisabled={isBusy}
          >
            <Ellipsis />
          </Button>

          <Dropdown.Popover>
            <Dropdown.Menu>
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
