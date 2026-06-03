import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type OrganizationPeopleProps = {
  class?: string
}

export function OrganizationPeople(props: OrganizationPeopleProps) {
  return (
    <div class={cn("grid gap-4 md:gap-6", props.class)}>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Member APIs are available from @better-auth-ui/solid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            The full members and invitations table UI is deferred to keep PR
            #393 reviewable. This shell reserves the members section for the
            next organization people slice.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
          <CardDescription>
            Invitation APIs are available from @better-auth-ui/solid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Invitation tables and actions remain deferred. Future slices can add
            invite, cancel, search, filters, and status UI here without changing
            the route contract.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
