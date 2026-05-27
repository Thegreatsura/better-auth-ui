import { AuthProvider } from "@better-auth-ui/heroui"
import {
  OrganizationProfile,
  organizationPlugin
} from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function OrganizationProfileDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
    >
      <div className="w-full">
        <OrganizationProfile />
      </div>
    </AuthProvider>
  )
}
