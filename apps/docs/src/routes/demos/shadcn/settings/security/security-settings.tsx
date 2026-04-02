import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/security/security-settings"
)({
  component: RouteComponent
})

import { SecuritySettings } from "@/components/settings/security/security-settings"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <SecuritySettings />
    </div>
  )
}
