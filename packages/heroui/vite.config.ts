import { copyFileSync } from "node:fs"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

/**
 * Copies `src/styles.css` to `dist/styles.css` after each build (including
 * each watch rebuild) so the `@better-auth-ui/heroui/styles` package export
 * survives `emptyOutDir` wipes and reflects edits in dev.
 */
function copyStyles(): Plugin {
  return {
    name: "better-auth-ui-heroui:copy-styles",
    apply: "build",
    closeBundle() {
      const src = resolve(__dirname, "src/styles.css")
      const dest = resolve(__dirname, "dist/styles.css")
      copyFileSync(src, dest)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      // Force a full type-check + emit on every dts run so cross-package
      // type changes propagate immediately in dev (vite build --watch);
      // incremental mode can otherwise skip re-emitting .d.ts files.
      compilerOptions: { incremental: false, composite: false }
    }),
    copyStyles()
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
        email: "src/email.ts",
        plugins: "src/plugins.ts"
      },
      formats: ["es"],
      fileName: "[name]"
    },
    rolldownOptions: {
      external: (id) =>
        !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
})
