import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import lastModified from "fumadocs-mdx/plugins/last-modified"
import {
  createFileSystemGeneratorCache,
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

/**
 * The fully-expanded `type` field can be enormous (e.g. `authClient` resolves
 * to the entire Better Auth client surface, 50KB+ of TypeScript). Shiki then
 * tokenises every character into HAST nodes that get serialised into the MDX
 * bundle, bloating it by hundreds of KB and slowing the build.
 *
 * When the expansion is far longer than the alias-form `simplifiedType`, fall
 * back to the alias — the table cell already shows it, and users wanting the
 * full surface can click through to the source.
 */
const MAX_TYPE_DESCRIPTION_LENGTH = 400

function collapseVerboseTypeExpansions(entry: DocEntry): void {
  if (
    entry.type.length > MAX_TYPE_DESCRIPTION_LENGTH &&
    entry.type.length > entry.simplifiedType.length * 4
  ) {
    entry.type = entry.simplifiedType
  }
}

const generator = createGenerator({
  cache: createFileSystemGeneratorCache(".cache/fumadocs-typescript")
})

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
              collapseVerboseTypeExpansions(entry)
            }
          }
          //  renderType: renderTypeToHastFast
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
