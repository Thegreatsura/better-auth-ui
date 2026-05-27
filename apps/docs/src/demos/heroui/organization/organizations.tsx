import { AuthProvider } from "@better-auth-ui/heroui"
import {
  Organizations,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <Organizations />
      </div>
    </AuthProvider>
  )
}
