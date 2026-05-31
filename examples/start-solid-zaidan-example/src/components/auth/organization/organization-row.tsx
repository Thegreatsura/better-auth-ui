import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useSetActiveOrganization } from "@better-auth-ui/solid"
import { useNavigate } from "@tanstack/solid-router"
import type { Organization } from "better-auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type OrganizationRowProps = {
  authClient: OrganizationAuthClient
  organization: Organization
}

export function OrganizationRow(props: OrganizationRowProps) {
  const navigate = useNavigate()
  const setActiveOrganization = useSetActiveOrganization(props.authClient, {
    onSuccess: () => {
      navigate({
        to: "/organization/$slug/$path",
        params: {
          slug: props.organization.slug,
          path: "settings"
        }
      })
    }
  })

  return (
    <Card size="sm">
      <CardContent class="flex items-center justify-between gap-4 py-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-medium">{props.organization.name}</p>
          <p class="truncate text-xs text-muted-foreground">
            /organization/{props.organization.slug}/settings
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={setActiveOrganization.isPending}
          onClick={() =>
            setActiveOrganization.mutate({
              organizationId: props.organization.id
            })
          }
        >
          Open
        </Button>
      </CardContent>
    </Card>
  )
}
