import { AuthProvider } from "@/components/auth/auth-provider"
import { SignUp } from "@/components/auth/sign-up"
import { authClient } from "@/lib/auth-client"
import { usernamePlugin } from "@/lib/username/username-plugin"

export function SignUpUsernameDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[usernamePlugin({ isUsernameAvailable: true })]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <SignUp />
    </AuthProvider>
  )
}
