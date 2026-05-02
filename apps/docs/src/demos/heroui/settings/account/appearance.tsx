import { AuthProvider } from "@better-auth-ui/heroui"
import { Appearance, themePlugin } from "@better-auth-ui/heroui/plugins"
import { useTheme } from "@heroui/react"

export function AppearanceDemo() {
  return (
    <AuthProvider
      authClient={{} as any}
      navigate={() => {}}
      plugins={[themePlugin(useTheme())]}
    >
      <div className="w-full">
        <Appearance />
      </div>
    </AuthProvider>
  )
}
