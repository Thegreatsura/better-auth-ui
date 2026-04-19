import { passkeyClient } from "@better-auth/passkey/client"
import { createAuthClient } from "better-auth/react"

export const passkeyAuthClient = createAuthClient({
  plugins: [passkeyClient()]
})

export type PasskeyAuthClient = typeof passkeyAuthClient
