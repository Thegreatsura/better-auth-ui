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

/** Optional props are typed as `T | undefined`; strip that for readability (required is shown separately). */
function stripUndefinedUnionFromOptional(entry: DocEntry): void {
  if (entry.required) return
  entry.simplifiedType = stripUndefinedUnion(entry.simplifiedType)
  entry.type = stripUndefinedUnion(entry.type)
}

function stripUndefinedUnion(s: string): string {
  let t = s.trim()
  const suffix = /\s*\|\s*undefined\b\s*$/
  const prefix = /^\s*undefined\s*\|\s*/
  let previous: string
  do {
    previous = t
    t = t.replace(suffix, "").replace(prefix, "").trim()
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
              stripUndefinedUnionFromOptional(entry)
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
