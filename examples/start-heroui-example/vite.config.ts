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
    noExternal: ["@gravity-ui/icons"]
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()]
})

export default config
