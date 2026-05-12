import { viewPaths } from "@better-auth-ui/core"
import { createFileRoute, notFound } from "@tanstack/solid-router"

import { Settings } from "@/routes/settings/-route-components"

export const Route = createFileRoute("/settings/$path")({
  beforeLoad({ params: { path } }) {
    if (!Object.values(viewPaths.settings).includes(path)) {
      throw notFound()
    }
  },
  component: SettingsPage
})

function SettingsPage() {
  const path = () => Route.useParams()().path

  return (
    <div class="mx-auto w-full max-w-3xl p-4 md:p-6">
      <Settings path={path()} />
    </div>
  )
}
