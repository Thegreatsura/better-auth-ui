import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/account/manage-accounts"
)({
  component: RouteComponent
})

import { ManageAccounts } from "@/components/settings/account/manage-accounts"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <ManageAccounts />
    </div>
  )
}
