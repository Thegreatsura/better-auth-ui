import { useNavigate } from "@tanstack/solid-router"
import { Settings as SettingsIcon, Users as UsersIcon } from "lucide-solid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationPeople } from "./organization-people"
import { OrganizationSettings } from "./organization-settings"

export type OrganizationProps = {
  path: string
  slug?: string
}

export function Organization(props: OrganizationProps) {
  const navigate = useNavigate()

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
        <TabsTrigger value="settings">
          <SettingsIcon class="text-muted-foreground" />
          Settings
        </TabsTrigger>
        <TabsTrigger value="people">
          <UsersIcon class="text-muted-foreground" />
          People
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings" tabIndex={-1}>
        <OrganizationSettings />
      </TabsContent>

      <TabsContent value="people" tabIndex={-1}>
        <OrganizationPeople />
      </TabsContent>
    </Tabs>
  )
}
