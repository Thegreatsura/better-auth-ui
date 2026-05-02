import { AuthProvider } from "@/components/auth/auth-provider"
import { UserButton } from "@/components/user/user-button"
import { authClient } from "@/lib/auth-client"
import { multiSessionPlugin } from "@/lib/multi-session/multi-session-plugin"

export function SwitchAccountSubmenuDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[multiSessionPlugin()]}
      socialProviders={["github", "google"]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <UserButton />
    </AuthProvider>
  )
}
