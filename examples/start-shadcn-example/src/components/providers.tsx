import { Link, useNavigate } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"
import { deleteUserPlugin } from "@/lib/delete-user/delete-user-plugin"
import { multiSessionPlugin } from "@/lib/multi-session/multi-session-plugin"
import { themePlugin } from "@/lib/theme/theme-plugin"
import { usernamePlugin } from "@/lib/username/username-plugin"
import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        socialProviders={["github"]}
        navigate={navigate}
        plugins={[
          deleteUserPlugin(),
          multiSessionPlugin(),
          themePlugin({ useTheme }),
          usernamePlugin({ isUsernameAvailable: true })
        ]}
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
