import { AuthProvider } from "@better-auth-ui/heroui"
import {
  Organization,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <Organization view="settings" />
      </div>
    </AuthProvider>
  )
}
