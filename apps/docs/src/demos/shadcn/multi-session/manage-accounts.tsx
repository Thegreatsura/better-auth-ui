import { AuthProvider } from "@/components/auth/auth-provider"
import { ManageAccounts } from "@/components/multi-session/manage-accounts"
import { authClient } from "@/lib/auth-client"
import { multiSessionPlugin } from "@/lib/multi-session/multi-session-plugin"

export function ManageAccountsDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[multiSessionPlugin()]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <div className="w-full">
        <ManageAccounts />
      </div>
    </AuthProvider>
  )
}
