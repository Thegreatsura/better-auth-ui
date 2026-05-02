import { AuthProvider, UserButton } from "@better-auth-ui/heroui"
import { themePlugin } from "@better-auth-ui/heroui/plugins"
import { authClient } from "@/lib/auth-client"

export function ThemeToggleItemDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[themePlugin()]}
    >
      <UserButton />
    </AuthProvider>
  )
}
