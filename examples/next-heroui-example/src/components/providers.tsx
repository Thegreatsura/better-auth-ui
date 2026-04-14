"use client"

import { AuthProvider } from "@better-auth-ui/heroui"
import { Toast } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <AuthProvider
      authClient={authClient}
      appearance={{ theme, setTheme }}
      deleteUser={{ enabled: true }}
      magicLink
      multiSession
      redirectTo="/dashboard"
      socialProviders={["google", "github"]}
      navigate={({ to, replace }) =>
        replace ? router.replace(to) : router.push(to)
      }
    >
      {children}

      <Toast.Provider />
    </AuthProvider>
  )
}
