import { copyFileSync } from "node:fs"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

/**
 * Copies `src/styles.css` to `dist/styles.css` after each build so the
 * `@better-auth-ui/heroui/styles` package export survives `emptyOutDir` wipes.
 */
function copyStyles(): Plugin {
  return {
    name: "better-auth-ui-heroui:copy-styles",
    apply: "build",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "src/styles.css"),
        resolve(__dirname, "dist/styles.css")
      )
    }
  }
}

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: "./tsconfig.json" }), copyStyles()],
  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
        email: "src/email.ts",
        plugins: "src/plugins.ts"
      },
      formats: ["es"]
    },
    rolldownOptions: {
      // Externalize all bare module IDs (not starting with `.` or `/` or `C:\`),
      // except `bowser`. Bowser ships a UMD `es5.js` via its `browser` field that
      // does not expose a real ESM `default` export, so leaving it external breaks
      // consumers using strict ESM resolvers (TanStack Start / Vite 7+ / Rolldown).
      // Bundling it inline sidesteps the interop issue entirely.
      external: (id) => id !== "bowser" && /^[^./](?!:[/\\])/.test(id)
    }
  }
})
