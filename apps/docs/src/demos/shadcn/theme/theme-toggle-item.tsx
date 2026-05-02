import { useTheme } from "fumadocs-ui/provider/base"

import { AuthProvider } from "@/components/auth/auth-provider"
import { UserButton } from "@/components/user/user-button"
import { authClient } from "@/lib/auth-client"
import { themePlugin } from "@/lib/theme/theme-plugin"

export function ThemeToggleItemDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[themePlugin({ useTheme })]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <UserButton />
    </AuthProvider>
  )
}
