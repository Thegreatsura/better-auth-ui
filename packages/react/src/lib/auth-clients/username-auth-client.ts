import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const usernameAuthClient = createAuthClient({
  plugins: [usernameClient()]
})

export type UsernameAuthClient = typeof usernameAuthClient
