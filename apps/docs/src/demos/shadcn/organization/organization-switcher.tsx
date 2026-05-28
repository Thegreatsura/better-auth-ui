import { AuthProvider } from "@/components/auth/auth-provider"
import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"

export function OrganizationSwitcherDemo() {
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
      <OrganizationSwitcher align="start" />
    </AuthProvider>
  )
}
