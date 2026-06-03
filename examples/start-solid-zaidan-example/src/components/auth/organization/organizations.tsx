import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useListOrganizations } from "@better-auth-ui/solid"
import { PlusCircle } from "lucide-solid"
import { createSignal, For, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationRow } from "./organization-row"

export type OrganizationsProps = {
  authClient: OrganizationAuthClient
}

export function Organizations(props: OrganizationsProps) {
  const organizations = useListOrganizations(props.authClient)
  const [createOpen, setCreateOpen] = createSignal(false)

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="font-medium">Organizations</h3>
          <p class="text-sm text-muted-foreground">
            Create and manage organizations for shared access.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} type="button">
          <PlusCircle class="size-4" />
          Create organization
        </Button>
      </div>

      <Show
        when={!organizations.isPending}
        fallback={
          <p class="text-sm text-muted-foreground">Loading organizations…</p>
        }
      >
        <div class="flex flex-col gap-2">
          <For
            each={organizations.data ?? []}
            fallback={
              <button
                class="rounded-md border border-dashed p-4 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setCreateOpen(true)}
                type="button"
              >
                No organizations yet. Create one to enable organization routes.
              </button>
            }
          >
            {(organization) => (
              <OrganizationRow
                authClient={props.authClient}
                organization={organization}
              />
            )}
          </For>
        </div>
      </Show>

      <CreateOrganizationDialog
        open={createOpen()}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}
