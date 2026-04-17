import { createFileRoute } from "@tanstack/react-router"
import { UserButtonIconDemo } from "@/demos/shadcn/user/user-button-icon"

export const Route = createFileRoute("/demos/shadcn/user/user-button-icon")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center p-4 md:p-6">
      <UserButtonIconDemo />
    </div>
  )
}
