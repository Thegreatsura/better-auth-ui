import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationMembers,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationMembersDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationMembers />
      </div>
    </AuthProvider>
  )
}
