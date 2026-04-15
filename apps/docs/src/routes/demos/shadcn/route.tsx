import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Providers } from "@/components/demos/shadcn/providers"
import herouiCss from "@/styles/shadcn.css?url"

export const Route = createFileRoute("/demos/shadcn")({
  component: RouteComponent,
  head: () => ({
    links: [{ rel: "stylesheet", href: herouiCss }]
  })
})

function RouteComponent() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}
