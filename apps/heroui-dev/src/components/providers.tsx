import { AuthProvider } from "@better-auth-ui/heroui"
import {
  apiKeyPlugin,
  deleteUserPlugin,
  magicLinkPlugin,
  multiSessionPlugin,
  organizationPlugin,
  passkeyPlugin,
  themePlugin,
  usernamePlugin
} from "@better-auth-ui/heroui/plugins"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        socialProviders={["github"]}
        navigate={navigate}
        plugins={[
          apiKeyPlugin(),
          passkeyPlugin(),
          usernamePlugin(),
          magicLinkPlugin(),
          deleteUserPlugin(),
          themePlugin({ useTheme }),
          multiSessionPlugin(),
          organizationPlugin()
        ]}
      >
        {children}

        <Toast.Provider />
      </AuthProvider>
    </ThemeProvider>
  )
}
