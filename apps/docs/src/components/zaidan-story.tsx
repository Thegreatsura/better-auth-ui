import type { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"

export type ZaidanStoryProps = Omit<
  ComponentPropsWithoutRef<"iframe">,
  "height" | "src" | "title"
> & {
  /** Storybook story id, for example `zaidan-infrastructure-storybook--placeholder`. */
  storyId: string
  /** Accessible iframe title. Defaults to the story id. */
  title?: string
  /** Embed height. Defaults to `520`. */
  height?: number | string
  /** Hosted Storybook base path. Defaults to `/storybook/zaidan`. */
  basePath?: string
  /** Optional class name for the outer preview frame. */
  containerClassName?: string
}

const DEFAULT_BASE_PATH = "/storybook/zaidan"
const DEFAULT_HEIGHT = 520

function normalizeBasePath(basePath: string) {
  return basePath.replace(/\/+$/, "")
}

export function ZaidanStory({
  storyId,
  title,
  height = DEFAULT_HEIGHT,
  basePath = DEFAULT_BASE_PATH,
  className,
  containerClassName,
  loading = "lazy",
  ...props
}: ZaidanStoryProps) {
  const normalizedBasePath = normalizeBasePath(basePath)
  const src = `${normalizedBasePath}/iframe.html?id=${encodeURIComponent(
    storyId
  )}&viewMode=story`
  const style = {
    "--zaidan-story-height": formatHeight(height)
  } as CSSProperties

  return (
    <div
      className={cn(
        "not-prose my-4 w-full overflow-hidden rounded-xl border border-separator bg-background",
        containerClassName
      )}
      style={style}
    >
      <iframe
        allow="clipboard-write"
        className={cn(
          "block h-[var(--zaidan-story-height)] w-full border-0",
          className
        )}
        loading={loading}
        src={src}
        title={title ?? `Zaidan story: ${storyId}`}
        {...props}
      />
    </div>
  )
}

function formatHeight(height: number | string) {
  return typeof height === "number" ? `${height}px` : height
}
