import { AuthProvider } from "@better-auth-ui/heroui"
import {
  organizationPlugin,
  UserInvitations
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function UserInvitationsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <UserInvitations />
      </div>
    </AuthProvider>
  )
}
