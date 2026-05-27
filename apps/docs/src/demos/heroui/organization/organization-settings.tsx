import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationSettings,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationSettingsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationSettings />
      </div>
    </AuthProvider>
  )
}
