import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useActiveOrganization, useAuth } from "@better-auth-ui/solid"
import { useNavigate } from "@tanstack/solid-router"
import { For, Show } from "solid-js"
import type { OrganizationCardsPlugin } from "@/components/auth/settings/shared/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authClient } from "@/lib/auth-client"

export type OrganizationProps = {
  path: string
  slug?: string
}

export function Organization(props: OrganizationProps) {
  const auth = useAuth()
  const navigate = useNavigate()
  const activeOrganization = useActiveOrganization(
    authClient as OrganizationAuthClient
  )
  const organizationCards = () =>
    (auth.plugins as OrganizationCardsPlugin[]).flatMap(
      (plugin) => plugin.organizationCards ?? []
    )

  const handlePathChange = (path: string) => {
    if (!props.slug) return

    navigate({
      to: "/organization/$slug/$path",
      params: { slug: props.slug, path }
    })
  }

  return (
    <Tabs
      value={props.path}
      onChange={handlePathChange}
      class="w-full gap-4 md:gap-6"
    >
      <TabsList aria-label="Organization sections">
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
      </TabsList>

      <TabsContent value="settings" tabIndex={-1}>
        <div class="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Show when={activeOrganization.data} fallback="Organization">
                  {(organization) => organization().name}
                </Show>
              </CardTitle>
              <CardDescription>
                Organization profile management is intentionally minimal in the
                Solid/Zaidan example for this slice. Use the package-level
                organization mutations to build custom name, slug, and logo
                forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">
                Implemented runtime coverage: active organization lookup, list,
                create, and switch. Deferred UI coverage: members, invitations,
                role editing, logo upload, delete, and leave dialogs.
              </p>
            </CardContent>
          </Card>

          <For each={organizationCards()}>
            {(OrganizationCard) => <OrganizationCard />}
          </For>
        </div>
      </TabsContent>

      <TabsContent value="people" tabIndex={-1}>
        <Card>
          <CardHeader>
            <CardTitle>People</CardTitle>
            <CardDescription>
              Member and invitation APIs are available from
              <code class="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                @better-auth-ui/solid
              </code>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              The full members and invitations table UI is deferred to keep PR
              #393 reviewable. This page reserves the route and documents the
              extension point.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
