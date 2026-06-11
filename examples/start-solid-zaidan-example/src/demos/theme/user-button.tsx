import { AuthProvider } from "@/components/auth/auth-provider"
import { UserButton } from "@/components/auth/user/user-button"
import { themePlugin } from "@/lib/auth/theme-plugin"
import { authClient } from "@/lib/auth-client"

export function ThemeUserButtonDemo() {
  return (
    <AuthProvider authClient={authClient} plugins={[themePlugin()]}>
      {() => <UserButton />}
    </AuthProvider>
  )
}
