import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationsSettings,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationsSettingsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationsSettings />
      </div>
    </AuthProvider>
  )
}
