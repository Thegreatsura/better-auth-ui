import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher"

import { OrganizationDemoWrapper } from "./organization-demo-wrapper"

export function OrganizationSwitcherDemo() {
  return (
    <OrganizationDemoWrapper>
      <OrganizationSwitcher align="start" />
    </OrganizationDemoWrapper>
  )
}
