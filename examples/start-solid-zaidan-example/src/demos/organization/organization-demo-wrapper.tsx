import type { JSX } from "solid-js"
import { AuthProvider } from "@/components/auth/auth-provider"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"

export function OrganizationDemoWrapper(props: { children: JSX.Element }) {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[organizationPlugin({ slug: "acme" })]}
    >
      <div class="w-full">{props.children}</div>
    </AuthProvider>
  )
}
