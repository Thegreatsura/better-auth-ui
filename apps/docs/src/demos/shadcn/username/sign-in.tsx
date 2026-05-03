import { AuthProvider } from "@/components/auth/auth-provider"
import { SignInUsername } from "@/components/username/sign-in-username"
import { authClient } from "@/lib/auth-client"
import { usernamePlugin } from "@/lib/username/username-plugin"

export function SignInUsernameDemo() {
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
      <SignInUsername />
    </AuthProvider>
  )
}
