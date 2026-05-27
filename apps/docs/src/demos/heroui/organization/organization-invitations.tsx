import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationInvitations,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationInvitationsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationInvitations />
      </div>
    </AuthProvider>
  )
}
