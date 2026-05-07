import { AuthProvider } from "@better-auth-ui/heroui"
import {
  deleteUserPlugin,
  multiSessionPlugin,
  themePlugin,
  usernamePlugin
} from "@better-auth-ui/heroui/plugins"
import {
  type CaptchaRenderProps,
  captchaPlugin
} from "@better-auth-ui/react/plugins"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Toast } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

function HCaptchaWidget({ setToken, clearToken }: CaptchaRenderProps) {
  const { theme } = useTheme()

  return (
    <HCaptcha
      sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
      onVerify={setToken}
      onExpire={clearToken}
      onError={clearToken}
      theme={theme}
    />
  )
}

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
            render: HCaptchaWidget
          })
        ]}
      >
        {children}

        <Toast.Provider />
      </AuthProvider>
    </ThemeProvider>
  )
}
