import { AuthProvider } from "@/components/auth/auth-provider"
import { UserProfile } from "@/components/settings/account/user-profile"
import { authClient } from "@/lib/auth-client"
import { usernamePlugin } from "@/lib/username/username-plugin"

export function UserProfileUsernameDemo() {
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
      <div className="w-full">
        <UserProfile />
      </div>
    </AuthProvider>
  )
}
