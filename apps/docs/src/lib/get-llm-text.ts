import type { InferPageType } from "fumadocs-core/source"
import type { DocMethods } from "fumadocs-mdx/runtime/types"
import type { source } from "@/lib/source"

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await (page.data as typeof page.data & DocMethods).getText(
    "processed"
  )

  return `# ${page.data.title} (${page.url})

${processed}`
}
