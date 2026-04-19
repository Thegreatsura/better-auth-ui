import { multiSessionClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const multiSessionAuthClient = createAuthClient({
  plugins: [multiSessionClient()]
})

export type MultiSessionAuthClient = typeof multiSessionAuthClient
