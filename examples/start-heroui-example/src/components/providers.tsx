import { AuthProvider } from "@better-auth-ui/heroui"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
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
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <AuthProvider
      authClient={authClient}
      socialProviders={["github", "google"]}
      magicLink
      multiSession
      navigate={navigate}
      settings={{
        appearance: { theme, setTheme }
      }}
    >
      {children}

      <Toast.Provider />
    </AuthProvider>
  )
}
