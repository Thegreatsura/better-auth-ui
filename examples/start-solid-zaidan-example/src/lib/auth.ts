import { type BetterAuthOptions, betterAuth } from "better-auth"
import { username } from "better-auth/plugins"

const authOptions = {
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:5173",
  emailAndPassword: {
    enabled: true
  },
  plugins: [username()],
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "solid-start-dev-secret-for-local-development-only"
} satisfies BetterAuthOptions

const auth = betterAuth(authOptions)

export const authHandler = (request: Request) => auth.handler(request)
