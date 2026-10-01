import { defineConfig } from "cf/config"
export default defineConfig({
  worker: {
    name: "heroui-dev",
    compatibilityDate: "2025-09-02",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "@tanstack/react-start/server-entry",
    observability: {
      logs: {
        enabled: true,
        invocationLogs: true
      }
    }
  }
})
