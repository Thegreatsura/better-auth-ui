import { AuthProvider } from "@/components/auth/auth-provider"
import { DangerZone } from "@/components/delete-user/danger-zone"
import { authClient } from "@/lib/auth-client"
import { deleteUserPlugin } from "@/lib/delete-user/delete-user-plugin"

export function DangerZoneDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[deleteUserPlugin()]}
      socialProviders={["github", "google"]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <div className="w-full">
        <DangerZone />
      </div>
    </AuthProvider>
  )
}
