import { AuthProvider } from "@/components/auth/auth-provider"
import { Passkeys } from "@/components/settings/security/passkeys"
import { authClient } from "@/lib/auth-client"
import { passkeyPlugin } from "@/lib/passkey/passkey-plugin"

export function PasskeysDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[passkeyPlugin()]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      <div className="w-full">
        <Passkeys />
      </div>
    </AuthProvider>
  )
}
