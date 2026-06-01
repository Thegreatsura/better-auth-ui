import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useActiveOrganization,
  useListOrganizations,
  useSetActiveOrganization
} from "@better-auth-ui/solid"
import { useNavigate } from "@tanstack/solid-router"
import type { Organization } from "better-auth/client"
import { BriefcaseBusiness, ChevronsUpDown } from "lucide-solid"
import { createMemo, createSignal, For, onMount, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"

export type OrganizationSwitcherProps = {
  class?: string
}

function OrganizationSwitcherTrigger(props: OrganizationSwitcherProps = {}) {
  return (
    <Button class={props.class} disabled variant="ghost">
      <BriefcaseBusiness class="size-4 text-muted-foreground" />
      <span class="hidden max-w-36 truncate sm:inline">Organization</span>
      <ChevronsUpDown class="size-4 text-muted-foreground" />
    </Button>
  )
}

function MountedOrganizationSwitcher(props: OrganizationSwitcherProps = {}) {
  const client = authClient as OrganizationAuthClient
  const navigate = useNavigate()
  const activeOrganization = useActiveOrganization(client)
  const organizations = useListOrganizations(client)
  const setActiveOrganization = useSetActiveOrganization(client)

  const openOrganization = (organization: Organization) => {
    setActiveOrganization.mutate(
      { organizationId: organization.id },
      {
        onSuccess: () => {
          navigate({
            to: "/organization/$slug/$path",
            params: { slug: organization.slug, path: "settings" }
          })
        }
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        class={props.class}
        disabled={organizations.isPending}
      >
        <BriefcaseBusiness class="size-4 text-muted-foreground" />
        <span class="hidden max-w-36 truncate sm:inline">
          {activeOrganization.data?.name ?? "Organization"}
        </span>
        <ChevronsUpDown class="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Show
          when={(organizations.data?.length ?? 0) > 0}
          fallback={
            <DropdownMenuItem
              onSelect={() =>
                navigate({
                  to: "/settings/$path",
                  params: { path: "organizations" }
                })
              }
            >
              Create your first organization
            </DropdownMenuItem>
          }
        >
          <For each={organizations.data ?? []}>
            {(organization) => (
              <DropdownMenuItem onSelect={() => openOrganization(organization)}>
                {organization.name}
              </DropdownMenuItem>
            )}
          </For>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() =>
              navigate({
                to: "/settings/$path",
                params: { path: "organizations" }
              })
            }
          >
            Manage organizations
          </DropdownMenuItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function OrganizationSwitcher(props: OrganizationSwitcherProps = {}) {
  const [isMounted, setIsMounted] = createSignal(false)

  onMount(() => setIsMounted(true))

  const content = createMemo(() =>
    isMounted() ? (
      <MountedOrganizationSwitcher {...props} />
    ) : (
      <OrganizationSwitcherTrigger {...props} />
    )
  )

  return <>{content()}</>
}
