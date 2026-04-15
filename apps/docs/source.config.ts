import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import lastModified from "fumadocs-mdx/plugins/last-modified"
import {
  createGenerator,
  type DocEntry,
  remarkAutoTypeTable
} from "fumadocs-typescript"
import remarkCodeImport from "remark-code-import"

/**
 * fumadocs-typescript's getSimpleForm() maps every union (including `T | undefined`
 * from optional props) to the literal string "union". DeepPartial makes most
 * AuthProvider-style props optional, so type tables become useless. Prefer the
 * full checker type string when that happens.
 */
function preferFullTypeForSimplifiedUnion(entry: DocEntry): void {
  if (entry.simplifiedType === "union") {
    entry.simplifiedType = entry.type
  }
}

/**
 * TypeScript prints optional fields as `prop?: T | undefined`. The `?` already
 * implies `undefined`, and nested object shapes in the expanded "Type" row are
 * especially noisy. Strip `| undefined` (and symmetric `undefined |`) everywhere
 * in the displayed string — docs-only, does not affect package types.
 */
function stripRedundantUndefinedUnions(entry: DocEntry): void {
  entry.simplifiedType = stripUndefinedUnionFromTypeString(entry.simplifiedType)
  entry.type = stripUndefinedUnionFromTypeString(entry.type)
}

function stripUndefinedUnionFromTypeString(s: string): string {
  let t = s
  let previous: string
  do {
    previous = t
    t = t
      .replace(/\s*\|\s*undefined\b/g, "")
      .replace(/\bundefined\s*\|\s*/g, "")
  } while (t !== previous)
  return t
}

const generator = createGenerator()

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: [
      [remarkCodeImport, { allowImportingFromOutside: true }],
      [
        remarkAutoTypeTable,
        {
          generator,
          options: {
            transform(entry: DocEntry) {
              preferFullTypeForSimplifiedUnion(entry)
              stripRedundantUndefinedUnions(entry)
            }
          }
          // renderType: renderTypeToHastFast
        }
      ]
    ],
    remarkNpmOptions: {
      persist: {
        id: "package-manager"
      }
    }
  }
})
