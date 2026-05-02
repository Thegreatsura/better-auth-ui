import { useTheme } from "fumadocs-ui/provider/base"

import { AuthProvider } from "@/components/auth/auth-provider"
import { Appearance } from "@/components/theme/appearance"
import { authClient } from "@/lib/auth-client"
import { themePlugin } from "@/lib/theme/theme-plugin"

export function AppearanceDemo() {
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
      <div className="w-full">
        <Appearance />
      </div>
    </AuthProvider>
  )
}
