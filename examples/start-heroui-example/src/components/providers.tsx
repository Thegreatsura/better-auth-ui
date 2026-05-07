import { AuthProvider } from "@better-auth-ui/heroui"
import {
  deleteUserPlugin,
  multiSessionPlugin,
  themePlugin,
  usernamePlugin
} from "@better-auth-ui/heroui/plugins"
import { captchaPlugin } from "@better-auth-ui/react/plugins"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"

import { TurnstileWidget } from "@/components/turnstile-widget"
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
        additionalFields={[
          {
            name: "birthday",
            type: "date",
            label: "Birthday",
            signUp: true,
            required: true
          }
        ]}
        plugins={[
          deleteUserPlugin(),
          multiSessionPlugin(),
          themePlugin({ useTheme }),
          usernamePlugin({ isUsernameAvailable: true }),
          captchaPlugin({
            render: TurnstileWidget
          })
        ]}
      >
        {children}

        <Toast.Provider />
      </AuthProvider>
    </ThemeProvider>
  )
}
