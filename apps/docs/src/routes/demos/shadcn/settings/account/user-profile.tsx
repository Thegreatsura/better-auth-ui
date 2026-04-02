import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/account/user-profile"
)({
  component: RouteComponent
})

import { UserProfile } from "@/components/settings/account/user-profile"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <UserProfile />
    </div>
  )
}
