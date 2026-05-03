import { AuthProvider, SignUp } from "@better-auth-ui/heroui"
import { usernamePlugin } from "@better-auth-ui/heroui/plugins"

import { authClient } from "@/lib/auth-client"

export function SignUpUsernameDemo() {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      plugins={[usernamePlugin({ isUsernameAvailable: true })]}
    >
      <SignUp />
    </AuthProvider>
  )
}
