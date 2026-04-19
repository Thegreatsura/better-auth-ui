import { magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const magicLinkAuthClient = createAuthClient({
  plugins: [magicLinkClient()]
})

export type MagicLinkAuthClient = typeof magicLinkAuthClient
