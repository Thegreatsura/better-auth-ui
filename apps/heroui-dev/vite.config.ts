import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const config = defineConfig({
  server: {
    port: 3000
  },
  resolve: {
    tsconfigPaths: true,
    noExternal: ["@gravity-ui/icons"],
    // Resolve workspace `@better-auth-ui/*` packages to their `src/` entrypoints
    // via the `src` export condition for hot reload during local development.
    // This mirrors `customConditions: ["src"]` in the monorepo's tsconfig and
    // does NOT leak to external consumers, since `src` is not in any bundler's
    // default condition list.
    conditions: ["src"]
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact()
  ]
})

export default config
