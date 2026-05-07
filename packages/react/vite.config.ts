import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      // Force a full type-check + emit on every dts run so cross-package
      // type changes propagate immediately in dev (vite build --watch);
      // incremental mode can otherwise skip re-emitting .d.ts files.
      compilerOptions: { incremental: false, composite: false }
    })
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        email: "src/email.ts",
        server: "src/server.ts",
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
