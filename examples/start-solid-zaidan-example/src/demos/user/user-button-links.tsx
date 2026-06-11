import { UserButton } from "@/components/auth/user/user-button"

export function UserButtonLinksDemo() {
  return (
    <UserButton
      links={[
        {
          label: <span>Dashboard</span>,
          href: "/dashboard",
          visibility: "authenticated"
        },
        { label: <span>Team</span>, href: "/team" }
      ]}
    />
  )
}
