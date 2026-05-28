import type { ReactNode } from "react"

import { AuthProvider } from "@/components/auth/auth-provider"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"

export function OrganizationDemoWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin()]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <div className="w-full">{children}</div>
    </AuthProvider>
  )
}
