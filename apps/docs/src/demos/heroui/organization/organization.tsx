import { Organization } from "@better-auth-ui/heroui/plugins"

import { OrganizationDemoWrapper } from "./organization-demo-wrapper"

export function OrganizationDemo() {
  return (
    <OrganizationDemoWrapper>
      <Organization view="settings" />
    </OrganizationDemoWrapper>
  )
}
