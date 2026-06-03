import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useActiveOrganization,
  useAuth,
  useListOrganizations,
  useSetActiveOrganization
} from "@better-auth-ui/solid"
import { useNavigate } from "@tanstack/solid-router"
import type { Organization } from "better-auth/client"
import { BriefcaseBusiness, ChevronsUpDown, Settings, User } from "lucide-solid"
import type { JSX } from "solid-js"
import {
  createMemo,
  createSignal,
  For,
  mergeProps,
  onMount,
  Show
} from "solid-js"
import { UserView } from "@/components/auth/user/user-view"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"

export type OrganizationSwitcherProps = {
  class?: string
  trigger?: JSX.Element
  hidePersonal?: boolean
  hideSettings?: boolean
  hideSlug?: boolean
  setActive?: (organization: Organization | null) => void
}

function OrganizationLabel(props: {
  organization: Organization
  hideSlug: boolean
}) {
  return (
    <span class="grid min-w-0 flex-1 text-left">
      <span class="truncate">{props.organization.name}</span>
      <Show when={!props.hideSlug}>
        <span class="truncate text-xs text-muted-foreground">
          /{props.organization.slug}
        </span>
      </Show>
    </span>
  )
}

function OrganizationSwitcherTrigger(rawProps: OrganizationSwitcherProps = {}) {
  const props = mergeProps({ hideSlug: true }, rawProps)

  return (
    <Show
      when={props.trigger}
      fallback={
        <Button class={props.class} disabled variant="ghost">
          <BriefcaseBusiness class="size-4 text-muted-foreground" />
          <span class="hidden max-w-36 truncate sm:inline">Organization</span>
          <ChevronsUpDown class="size-4 text-muted-foreground" />
        </Button>
      }
    >
      {props.trigger}
    </Show>
  )
}

function MountedOrganizationSwitcher(rawProps: OrganizationSwitcherProps = {}) {
  const props = mergeProps({ hideSlug: true }, rawProps)
  const auth = useAuth()
  const client = authClient as OrganizationAuthClient
  const navigate = useNavigate()
  const activeOrganization = useActiveOrganization(client)
  const organizations = useListOrganizations(client)
  const setActiveOrganization = useSetActiveOrganization(client)
  const [isOpen, setIsOpen] = createSignal(false)
  const organizationPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === organizationPlugin.id) as
      | { slug?: string | null }
      | undefined
  const isSlugMode = () => {
    const plugin = organizationPluginConfig()

    if (!plugin) return false

    return plugin.slug !== undefined
  }
  const selectableOrganizations = () =>
    ((organizations.data ?? []) as Organization[]).filter(
      (organization) => organization.id !== activeOrganization.data?.id
    )

  const navigateToOrganization = (organization: Organization) => {
    navigate({
      to: "/organization/$slug/$path",
      params: { slug: organization.slug, path: "settings" }
    })
  }

  const navigateToPersonal = () => {
    navigate({
      to: "/settings/$path",
      params: { path: "account" }
    })
  }

  const handleSetActive = (organization: Organization | null) => {
    setIsOpen(false)

    if (organization) props.setActive?.(organization)
    if (!organization) props.setActive?.(null)
    if (props.setActive) return

    if (isSlugMode()) {
      if (organization) {
        navigateToOrganization(organization)
        return
      }

      navigateToPersonal()
      return
    }

    setActiveOrganization.mutate(
      { organizationId: organization?.id ?? null },
      {
        onSuccess: () => {
          if (organization) {
            navigateToOrganization(organization)
            return
          }

          navigateToPersonal()
        }
      }
    )
  }

  return (
    <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
      <Show
        when={props.trigger}
        fallback={
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
        }
      >
        <DropdownMenuTrigger as="span" class={props.class}>
          {props.trigger}
        </DropdownMenuTrigger>
      </Show>
      <DropdownMenuContent class="min-w-64">
        <DropdownMenuLabel class="px-2 py-1.5 font-normal">
          <Show
            when={activeOrganization.data}
            fallback={
              <Show when={!props.hidePersonal} fallback="Organizations">
                <UserView />
              </Show>
            }
          >
            {(organization) => (
              <div class="flex items-center gap-2">
                <BriefcaseBusiness class="size-4 text-muted-foreground" />
                <OrganizationLabel
                  organization={organization()}
                  hideSlug={props.hideSlug}
                />
              </div>
            )}
          </Show>
        </DropdownMenuLabel>
        <Show when={!props.hideSettings}>
          <DropdownMenuItem
            onSelect={() =>
              navigate({
                to: "/settings/$path",
                params: { path: "organizations" }
              })
            }
          >
            <Settings class="size-4 text-muted-foreground" />
            Manage organizations
          </DropdownMenuItem>
        </Show>
        <DropdownMenuSeparator />
        <Show when={activeOrganization.data && !props.hidePersonal}>
          <DropdownMenuItem onSelect={() => handleSetActive(null)}>
            <User class="size-4 text-muted-foreground" />
            Personal account
          </DropdownMenuItem>
        </Show>
        <Show
          when={selectableOrganizations().length > 0}
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
          <For each={selectableOrganizations()}>
            {(organization) => (
              <DropdownMenuItem onSelect={() => handleSetActive(organization)}>
                <OrganizationLabel
                  organization={organization}
                  hideSlug={props.hideSlug}
                />
              </DropdownMenuItem>
            )}
          </For>
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
