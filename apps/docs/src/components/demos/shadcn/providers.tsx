import { AuthProvider } from "@better-auth-ui/react"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      magicLink
      multiSession
      deleteUser={{ enabled: true }}
      navigate={() => {}}
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
      {children}
    </AuthProvider>
  )
}
