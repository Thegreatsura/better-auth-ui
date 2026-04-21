import { AuthProvider } from "@better-auth-ui/heroui"
import { magicLinkPlugin } from "@better-auth-ui/heroui/plugins"
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
      appearance={{ theme, setTheme }}
      deleteUser={{ enabled: true }}
      multiSession
      passkey
      plugins={[magicLinkPlugin()]}
      redirectTo="/dashboard"
      socialProviders={["github"]}
      navigate={navigate}
    >
      {children}

      <Toast.Provider />
    </AuthProvider>
  )
}
