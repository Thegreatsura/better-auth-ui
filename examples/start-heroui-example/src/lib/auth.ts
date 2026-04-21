import { passkey } from "@better-auth/passkey"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { multiSession, username } from "better-auth/plugins"

import { db } from "./db"
import * as schema from "./schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: true
  }),
  emailAndPassword: {
    enabled: true
  },
  secret: process.env.BETTER_AUTH_SECRET as string,
  plugins: [multiSession(), passkey(), username()],
  session: {
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  user: {
    additionalFields: {
      premium: {
        type: "boolean",
        required: false
      }
    },
    deleteUser: {
      enabled: true
    }
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  }
})
