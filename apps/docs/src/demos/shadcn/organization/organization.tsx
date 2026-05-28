import { Organization } from "@/components/auth/organization/organization"

import { OrganizationDemoWrapper } from "./organization-demo-wrapper"

export function OrganizationDemo() {
  return (
    <OrganizationDemoWrapper>
      <Organization view="settings" />
    </OrganizationDemoWrapper>
  )
}
