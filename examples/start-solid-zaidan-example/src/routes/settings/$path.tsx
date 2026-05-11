import { viewPaths } from "@better-auth-ui/core"
import { createFileRoute, notFound } from "@tanstack/solid-router"

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
      <h1 class="text-2xl font-semibold">Settings</h1>
      <p class="mt-2 text-muted-foreground">
        Solid/Zaidan minimal {path()} settings route.
      </p>
    </div>
  )
}
