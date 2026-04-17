import { createFileRoute, Outlet, useParams } from "@tanstack/react-router"
import { Providers as HeroUIProviders } from "@/components/demos/heroui/providers"
import { Providers as ShadcnProviders } from "@/components/demos/shadcn/providers"

import appCss from "@/styles/app.css?url"

export const Route = createFileRoute("/docs")({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  component: RouteComponent
})

function RouteComponent() {
  const params = useParams({ from: "/docs/$" })
  const slugs = params._splat?.split("/") ?? []

  if (slugs.includes("heroui")) {
    return (
      <HeroUIProviders>
        <Outlet />
      </HeroUIProviders>
    )
  }

  return (
    <ShadcnProviders>
      <Outlet />
    </ShadcnProviders>
  )
}
