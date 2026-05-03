import { AuthProvider } from "@/components/auth/auth-provider"
import { SignIn } from "@/components/auth/sign-in"
import { passkeyPlugin } from "@/lib/auth/passkey-plugin"
import { authClient } from "@/lib/auth-client"

export function PasskeySignInDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[passkeyPlugin()]}
      socialProviders={["github", "google"]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <SignIn />
    </AuthProvider>
  )
}
