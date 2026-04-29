import { AuthProvider } from "@/components/auth/auth-provider"
import { MagicLink } from "@/components/auth/magic-link"
import { authClient } from "@/lib/auth-client"
import { magicLinkPlugin } from "@/lib/magic-link/magic-link-plugin"

export function MagicLinkDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[magicLinkPlugin()]}
      socialProviders={["github", "google"]}
      appearance={{
        theme: "system",
        setTheme: () => {}
      }}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <MagicLink />
    </AuthProvider>
  )
}
