import { captchaPlugin } from "@better-auth-ui/react/plugins"
import { Link, useNavigate } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"
import { TurnstileWidget } from "@/components/turnstile-widget"
import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin"
import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin"
import { themePlugin } from "@/lib/auth/theme-plugin"
import { usernamePlugin } from "@/lib/auth/username-plugin"
import { authClient } from "@/lib/auth-client"
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
          usernamePlugin({ isUsernameAvailable: true }),
          captchaPlugin({
            render: TurnstileWidget
          })
        ]}
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
