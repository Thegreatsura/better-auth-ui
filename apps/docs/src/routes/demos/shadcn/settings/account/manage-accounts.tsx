import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/shadcn/settings/account/manage-accounts"
)({
  component: RouteComponent
})

import { ManageAccounts } from "@better-auth-ui/shadcn"

function RouteComponent() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <ManageAccounts />
    </div>
  )
}
