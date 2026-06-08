import { spawn } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(scriptDir, "..")
const repoRoot = resolve(docsRoot, "../..")
const zaidanStorybookScript = resolve(
  repoRoot,
  "examples/start-solid-zaidan-example/scripts/build-docs-storybook.ts"
)

async function runStep(
  command: string,
  args: string[],
  cwd: string,
  env?: Record<string, string>
) {
  const label = [command, ...args].join(" ")
  console.log(`\n> ${label}`)

  const exitCode = await new Promise<number | null>((resolveExitCode) => {
    const proc = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      stdio: "inherit",
      env: env ? { ...process.env, ...env } : undefined
    })

    proc.on("close", resolveExitCode)
  })

  if (exitCode !== 0) {
    throw new Error(`${label} failed with exit code ${exitCode}`)
  }
}

async function main() {
  console.log("Building Zaidan Storybook assets for docs...")
  await runStep("bun", [zaidanStorybookScript], repoRoot)

  console.log("Building docs...")
  await runStep("bunx", ["vite", "build"], docsRoot, {
    NODE_OPTIONS: "--max-old-space-size=8192"
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
