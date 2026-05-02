import type { ReactNode } from "react"

import { AuthProvider } from "@/components/auth/auth-provider"
import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      deleteUser={{ enabled: true }}
      navigate={() => {}}
      socialProviders={["github", "google"]}
      Link={(props) => (
        // biome-ignore lint/a11y/useValidAnchor: ignore
        <a {...props} href={undefined} />
      )}
    >
      {children}
    </AuthProvider>
  )
}
