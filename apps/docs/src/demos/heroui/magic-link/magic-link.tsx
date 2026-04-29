import { AuthProvider, MagicLink } from "@better-auth-ui/heroui"
import { magicLinkPlugin } from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function MagicLinkDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[magicLinkPlugin()]}
      socialProviders={["github", "google"]}
      appearance={{
        theme: "system",
        setTheme: () => {}
      }}
    >
      <MagicLink />
    </AuthProvider>
  )
}
