import { AuthProvider, UserButton } from "@better-auth-ui/heroui"
import { themePlugin } from "@better-auth-ui/heroui/plugins"
import { useTheme } from "@heroui/react"
import { authClient } from "@/lib/auth-client"

export function ThemeToggleItemDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[themePlugin(useTheme())]}
    >
      <UserButton />
    </AuthProvider>
  )
}
