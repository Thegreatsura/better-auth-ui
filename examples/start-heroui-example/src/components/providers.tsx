import { AuthProvider } from "@better-auth-ui/heroui"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <AuthProvider
      authClient={authClient}
      socialProviders={["github", "google"]}
      deleteUser={{ enabled: true }}
      magicLink
      multiSession
      redirectTo="/dashboard"
      navigate={navigate}
      appearance={{ theme, setTheme }}
    >
      {children}

      <Toast.Provider />
    </AuthProvider>
  )
}
