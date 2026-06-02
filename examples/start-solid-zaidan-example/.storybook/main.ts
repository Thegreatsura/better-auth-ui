import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "storybook-solidjs-vite"
import { mergeConfig, type PluginOption, type UserConfig } from "vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "storybook-solidjs-vite",
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  async viteFinal(config: UserConfig) {
    const plugins = removeTanStackStartPlugins(config.plugins)

    return mergeConfig(
      {
        ...config,
        plugins
      },
      {
        base: process.env.STORYBOOK_BASE_PATH || "/",
        plugins: [tailwindcss()],
        resolve: {
          alias: {
            "@": resolve(__dirname, "../src")
          },
          conditions: ["browser", "default"],
          dedupe: ["solid-js", "solid-js/store", "solid-js/web"]
        },
        build: {
          target: "esnext"
        },
        ssr: {
          noExternal: ["@better-auth-ui/solid"]
        }
      }
    )
  }
}

function removeTanStackStartPlugins(plugins: PluginOption | undefined) {
  if (!Array.isArray(plugins)) return plugins

  const filtered: PluginOption[] = []

  for (const plugin of plugins) {
    if (!plugin || typeof plugin === "boolean") continue

    if (Array.isArray(plugin)) {
      const nested = removeTanStackStartPlugins(plugin)
      if (Array.isArray(nested)) filtered.push(...nested)
      continue
    }

    const name = String((plugin as { name?: string }).name)
    if (!name.includes("tanstack")) filtered.push(plugin)
  }

  return filtered
}

export default config
