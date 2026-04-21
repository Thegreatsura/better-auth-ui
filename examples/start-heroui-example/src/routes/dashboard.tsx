import { useAuth, useAuthenticate } from "@better-auth-ui/heroui/react"
import { Spinner } from "@heroui/react"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard
})

function Dashboard() {
  const { authClient } = useAuth()
  const { data: session } = useAuthenticate(authClient)

  if (!session) {
    return (
      <div className="flex justify-center my-auto">
        <Spinner color="current" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center my-auto">
      <h1 className="text-2xl">Hello, {session.user.email}</h1>

      <Link to="/auth/$path" params={{ path: "sign-out" }}>
        Sign Out
      </Link>
    </div>
  )
}
