import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/security/danger-zone"
)({
  component: RouteComponent
})

import { DangerZone } from "@/components/settings/security/danger-zone"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <DangerZone />
    </div>
  )
}
