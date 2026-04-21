import { Auth } from "@better-auth-ui/heroui"
import { viewPaths } from "@better-auth-ui/heroui/core"
import { magicLinkPlugin } from "@better-auth-ui/heroui/plugins"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (
      !Object.values({
        ...viewPaths.auth,
        ...magicLinkPlugin().viewPaths.auth
      }).includes(path)
    ) {
      throw notFound()
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}
