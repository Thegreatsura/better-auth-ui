import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useAuth, useSetActiveOrganization } from "@better-auth-ui/solid"
import { useNavigate } from "@tanstack/solid-router"
import type { Organization } from "better-auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

export type OrganizationRowProps = {
  authClient: OrganizationAuthClient
  organization: Organization
}

export function OrganizationRow(props: OrganizationRowProps) {
  const auth = useAuth()
  const navigate = useNavigate()
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | { slug?: string | null }
      | undefined
  const isSlugMode = () => {
    const plugin = organizationPluginConfig()

    if (!plugin) return false

    return plugin.slug !== undefined
  }
  const navigateToOrganization = () => {
    navigate({
      to: "/organization/$slug/$path",
      params: {
        slug: props.organization.slug,
        path: "settings"
      }
    })
  }
  const setActiveOrganization = useSetActiveOrganization(props.authClient, {
    onSuccess: navigateToOrganization
  })

  const openOrganization = () => {
    if (isSlugMode()) {
      navigateToOrganization()
      return
    }

    setActiveOrganization.mutate({
      organizationId: props.organization.id
    })
  }

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
          onClick={openOrganization}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  )
}
