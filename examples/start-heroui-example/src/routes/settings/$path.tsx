import { viewPaths } from "@better-auth-ui/core"
import { Settings } from "@better-auth-ui/heroui"
import { ensureSession } from "@better-auth-ui/react"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/settings/$path")({
  async beforeLoad({ params: { path }, context: { queryClient }, location }) {
    if (!Object.values(viewPaths.settings).includes(path)) {
      throw notFound()
    }

    const session = await ensureSession(authClient, queryClient)

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirect: location.href }
      })
    }

    return { user: session.user }
  },
  component: SettingsPage
})

function SettingsPage() {
  const { path } = Route.useParams()
  const context = Route.useRouteContext()

  console.log("user", context.user)

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <Settings path={path} />
    </div>
  )
}
