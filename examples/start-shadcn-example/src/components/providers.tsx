import { Link, useNavigate } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"
import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <AuthProvider
      authClient={authClient}
      appearance={{ theme, setTheme }}
      deleteUser={{ enabled: true }}
      magicLink
      multiSession
      passkey
      socialProviders={["github", "google"]}
      redirectTo="/dashboard"
      navigate={navigate}
      Link={Link}
    >
      {children}

      <Toaster />
    </AuthProvider>
  )
}
