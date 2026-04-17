import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState
} from "@tanstack/react-router"
import { RootProvider } from "fumadocs-ui/provider/tanstack"
import type * as React from "react"
import { Toaster } from "sonner"
import SearchDialog from "@/components/search"
import { cn } from "@/lib/utils"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Better Auth UI"
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Better Auth UI"
      }
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96"
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico"
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180"
      },
      {
        rel: "manifest",
        href: "/site.webmanifest"
      }
    ]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDemo = pathname.startsWith("/demos/")
  /** Email previews use a `grow` iframe and need a definite column height from the body. */
  const isEmailDemo = isDemo && pathname.includes("/email/")
  const compactDemoBody = isDemo && !isEmailDemo

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn(
          "flex flex-col antialiased",
          compactDemoBody ? "min-h-0 bg-background" : "min-h-svh"
        )}
      >
        <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
