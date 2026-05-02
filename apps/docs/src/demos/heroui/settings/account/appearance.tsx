import { AuthProvider } from "@better-auth-ui/heroui"
import { Appearance, themePlugin } from "@better-auth-ui/heroui/plugins"

export function AppearanceDemo() {
  return (
    <AuthProvider
      authClient={{} as any}
      navigate={() => {}}
      plugins={[
        themePlugin({
          theme: "system",
          setTheme: () => {}
        })
      ]}
    >
      <div className="w-full">
        <Appearance />
      </div>
    </AuthProvider>
  )
}
