import { Auth } from "@better-auth-ui/shadcn"
import { viewPaths } from "@better-auth-ui/shadcn/core"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!Object.values(viewPaths.auth).includes(path)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { path } = Route.useParams()

  return <Auth path={path} className="mx-auto my-auto" />
}
