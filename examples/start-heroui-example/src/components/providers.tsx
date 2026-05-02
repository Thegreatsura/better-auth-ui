import { AuthProvider } from "@better-auth-ui/heroui"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={authClient}
      deleteUser={{ enabled: true }}
      redirectTo="/settings/account"
      socialProviders={["github"]}
      navigate={navigate}
    >
      {children}

      <Toast.Provider />
    </AuthProvider>
  )
}
