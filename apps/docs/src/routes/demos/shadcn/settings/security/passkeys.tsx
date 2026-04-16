import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/security/passkeys"
)({
  component: RouteComponent
})

import { Passkeys } from "@/components/settings/security/passkeys"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Passkeys />
    </div>
  )
}
