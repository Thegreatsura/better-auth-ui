import { AuthProvider } from "@better-auth-ui/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"
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
      username={{ enabled: true }}
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
