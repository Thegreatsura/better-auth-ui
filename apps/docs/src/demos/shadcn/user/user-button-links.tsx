import { UserButton } from "@/components/auth/user/user-button"

export function UserButtonLinksDemo() {
  return (
    <UserButton
      links={[
        { label: "Dashboard", href: "/dashboard", visibility: "authenticated" },
        { label: "Team", href: "/team" }
      ]}
    />
  )
}
