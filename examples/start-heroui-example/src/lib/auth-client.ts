import { passkeyClient } from "@better-auth/passkey/client"
import {
  inferAdditionalFields,
  multiSessionClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { auth } from "./auth"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    passkeyClient()
  ]
})

declare module "@better-auth-ui/heroui/react" {
  interface AuthConfig {
    AuthClient: typeof authClient
  }
}
