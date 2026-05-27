import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationDangerZone,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationDangerZoneDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationDangerZone />
      </div>
    </AuthProvider>
  )
}
