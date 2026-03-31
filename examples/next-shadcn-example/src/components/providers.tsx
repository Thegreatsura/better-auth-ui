"use client"

import { AuthProvider } from "@better-auth-ui/shadcn/react"
import { ToastProvider } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

/**
 * Wraps the app UI with theme, routing, authentication, and global toast providers.
 *
 * @param children - The application UI to render inside the providers
 * @returns A React element containing ThemeProvider > RouterProvider > AuthProvider with the provided `children` and a global `Toaster`
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <AuthProvider
      authClient={authClient}
      socialProviders={["google", "github"]}
      magicLink
      multiSession
      redirectTo="/dashboard"
      navigate={({ to, replace }) =>
        replace ? router.replace(to) : router.push(to)
      }
      settings={{
        appearance: { theme, setTheme }
      }}
    >
      {children}

      <ToastProvider />
    </AuthProvider>
  )
}
