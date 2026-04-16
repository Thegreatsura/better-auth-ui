import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/schema.ts", // Your schema file path
  out: "./drizzle", // Your migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
})
