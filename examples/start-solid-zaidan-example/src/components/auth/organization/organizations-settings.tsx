import { organizationLocalization } from "@better-auth-ui/core/plugins"
import { useAuth } from "@better-auth-ui/solid"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Organizations } from "./organizations"

export type OrganizationsSettingsProps = {
  class?: string
}

export function OrganizationsSettings(props: OrganizationsSettingsProps = {}) {
  const auth = useAuth()

  return (
    <div class={cn("flex w-full flex-col gap-4 md:gap-6", props.class)}>
      <Card>
        <CardHeader>
          <CardTitle>{organizationLocalization.organizations}</CardTitle>
          <CardDescription>
            Create an organization, switch the active organization, and open the
            organization route for deeper settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Organizations authClient={auth.authClient as never} />
        </CardContent>
      </Card>
    </div>
  )
}
