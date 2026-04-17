import { createFileRoute } from "@tanstack/react-router"
import { UserButtonIconDemo } from "@/demos/heroui/user/user-button-icon"

export const Route = createFileRoute("/demos/heroui/user/user-button-icon")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center p-4 md:p-6">
      <UserButtonIconDemo />
    </div>
  )
}
