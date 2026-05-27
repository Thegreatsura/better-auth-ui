import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationPeople,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationPeopleDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationPeople />
      </div>
    </AuthProvider>
  )
}
