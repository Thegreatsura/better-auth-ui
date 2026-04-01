import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Providers } from "@/components/demos/heroui/providers"
import herouiCss from "@/styles/heroui.css?url"

export const Route = createFileRoute("/demos/heroui")({
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
