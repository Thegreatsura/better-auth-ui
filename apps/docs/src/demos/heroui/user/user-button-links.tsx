import { UserButton } from "@better-auth-ui/heroui"

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
