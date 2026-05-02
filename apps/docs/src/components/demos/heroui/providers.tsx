import { AuthProvider } from "@better-auth-ui/heroui"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      deleteUser={{ enabled: true }}
      navigate={() => {}}
      socialProviders={["github", "google"]}
    >
      {children}
    </AuthProvider>
  )
}
