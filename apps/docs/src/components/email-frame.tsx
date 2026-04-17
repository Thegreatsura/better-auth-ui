import { useTheme } from "fumadocs-ui/provider/base"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface EmailFrameProps {
  title: string
  srcDoc: string
  className?: string
}

export function EmailFrame({ title, srcDoc, className }: EmailFrameProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      loading="eager"
      className={cn(
        "w-full border-0",
        mounted ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        colorScheme: isDark ? "dark" : "light"
      }}
    />
  )
}
