import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useActiveOrganization,
  useAuth,
  useUpdateOrganization
} from "@better-auth-ui/solid"
import { createEffect, createSignal, Show } from "solid-js"
import { toast } from "solid-sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"
import { ChangeOrganizationLogo } from "./change-organization-logo"
import { SlugField } from "./slug-field"

export type OrganizationProfileProps = {
  class?: string
}

const fallbackLocalization = {
  organizationProfile: "Organization profile",
  organizationsDescription:
    "Create an organization to collaborate with others and manage shared access.",
  name: "Name",
  namePlaceholder: "Enter the organization name",
  organizationUpdatedSuccess: "Organization updated successfully"
} satisfies Pick<
  OrganizationLocalization,
  | "organizationProfile"
  | "organizationsDescription"
  | "name"
  | "namePlaceholder"
  | "organizationUpdatedSuccess"
>

export function OrganizationProfile(props: OrganizationProfileProps) {
  const auth = useAuth()
  const activeOrganization = useActiveOrganization(
    authClient as OrganizationAuthClient
  )
  const updateOrganization = useUpdateOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () => toast.success(localization().organizationUpdatedSuccess)
    }
  )
  const [name, setName] = createSignal("")
  const [slug, setSlug] = createSignal("")
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | { localization?: OrganizationLocalization }
      | undefined
  const localization = () =>
    organizationPluginConfig()?.localization ?? fallbackLocalization

  createEffect(() => {
    const organization = activeOrganization.data

    if (!organization) return

    setName(organization.name)
    setSlug(organization.slug)
  })

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    updateOrganization.mutate({ data: { name: name(), slug: slug() } })
  }

  return (
    <Card class={props.class}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{localization().organizationProfile}</CardTitle>
          <CardDescription>
            {localization().organizationsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <ChangeOrganizationLogo />

          <Show
            when={activeOrganization.data}
            fallback={
              <div class="grid gap-4">
                <Skeleton class="h-10 rounded-md" />
                <Skeleton class="h-10 rounded-md" />
              </div>
            }
          >
            {(organization) => (
              <>
                <div class="grid gap-2">
                  <Label for="organization-profile-name">
                    {localization().name}
                  </Label>
                  <Input
                    disabled={updateOrganization.isPending}
                    id="organization-profile-name"
                    name="name"
                    onInput={(event) => setName(event.currentTarget.value)}
                    placeholder={localization().namePlaceholder}
                    required
                    value={name()}
                  />
                </div>

                <SlugField
                  currentSlug={organization().slug}
                  disabled={updateOrganization.isPending}
                  id="organization-profile-slug"
                  onChange={setSlug}
                  value={slug()}
                />
              </>
            )}
          </Show>
        </CardContent>
        <CardFooter class="justify-end">
          <Button
            disabled={!activeOrganization.data || updateOrganization.isPending}
            type="submit"
          >
            {auth.localization.settings.saveChanges}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
