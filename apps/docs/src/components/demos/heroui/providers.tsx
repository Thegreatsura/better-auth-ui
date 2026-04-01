import { AuthProvider } from "@better-auth-ui/heroui"
import { useNavigate } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={authClient}
      magicLink
      multiSession
      deleteUser={{ enabled: true }}
      navigate={navigate}
      socialProviders={["github", "google"]}
    >
      {children}
    </AuthProvider>
  )
}
