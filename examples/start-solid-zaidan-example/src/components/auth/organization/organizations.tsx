import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useCreateOrganization,
  useListOrganizations
} from "@better-auth-ui/solid"
import { createSignal, For, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OrganizationRow } from "./organization-row"

export type OrganizationsProps = {
  authClient: OrganizationAuthClient
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export function Organizations(props: OrganizationsProps) {
  const organizations = useListOrganizations(props.authClient)
  const createOrganization = useCreateOrganization(props.authClient, {
    onSuccess: () => setName("")
  })
  const [name, setName] = createSignal("")

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    const nextName = name().trim()

    if (!nextName) return

    createOrganization.mutate({
      name: nextName,
      slug: slugify(nextName)
    })
  }

  return (
    <div class="flex flex-col gap-4">
      <form class="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <div class="grid gap-2">
          <Label for="organization-name">Organization name</Label>
          <Input
            id="organization-name"
            name="name"
            value={name()}
            onInput={(event) => setName(event.currentTarget.value)}
            placeholder="Acme Inc."
            disabled={createOrganization.isPending}
          />
        </div>
        <Button
          class="self-end"
          type="submit"
          disabled={createOrganization.isPending}
        >
          Create organization
        </Button>
      </form>

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
              <p class="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                No organizations yet. Create one to enable organization routes.
              </p>
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
    </div>
  )
}
