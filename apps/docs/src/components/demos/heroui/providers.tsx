import { AuthProvider } from "@better-auth-ui/heroui"
import { passkeyPlugin } from "@better-auth-ui/heroui/plugins"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      magicLink
      multiSession
      deleteUser={{ enabled: true }}
      navigate={() => {}}
      plugins={[passkeyPlugin()]}
      socialProviders={["github", "google"]}
      appearance={{
        theme: "system",
        setTheme: () => {}
      }}
    >
      {children}
    </AuthProvider>
  )
}
