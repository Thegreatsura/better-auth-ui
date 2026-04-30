import {
  type MultiSessionAuthClient,
  useAuth,
  useSetActiveSession
} from "@better-auth-ui/react"
import { Dropdown, Spinner } from "@heroui/react"
import type { Session, User } from "better-auth"
import { UserView } from "../user/user-view"

type DeviceSession = {
  session: Session
  user: User
}

export type SwitchAccountItemProps = {
  deviceSession: DeviceSession
}

/**
 * Render a dropdown item for switching to a different authenticated session.
 *
 * @param deviceSession - The device session to display and switch to when pressed
 * @returns The switch account dropdown item as a JSX element
 */
export function SwitchAccountItem({ deviceSession }: SwitchAccountItemProps) {
  const { authClient } = useAuth()
  const { mutate: setActiveSession, isPending } = useSetActiveSession(
    authClient as MultiSessionAuthClient,
    {
      onSuccess: () => window.scrollTo({ top: 0 })
    }
  )

  return (
    <Dropdown.Item
      className="px-2"
      isDisabled={isPending}
      onPress={() =>
        setActiveSession({ sessionToken: deviceSession.session.token })
      }
    >
      <UserView user={deviceSession.user} />

      {isPending && <Spinner color="current" size="sm" className="ml-auto" />}
    </Dropdown.Item>
  )
}
