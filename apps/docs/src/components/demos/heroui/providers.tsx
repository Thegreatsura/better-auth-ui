import { AuthProvider } from "@better-auth-ui/heroui"
import { deleteUserPlugin } from "@better-auth-ui/heroui/plugins"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      socialProviders={["github", "google"]}
      plugins={[deleteUserPlugin()]}
    >
      {children}
    </AuthProvider>
  )
}
