import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import {
  useActiveOrganization,
  useAuth,
  useHasPermission
} from "@better-auth-ui/solid"
import { createSignal, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteOrganizationDialog } from "./delete-organization-dialog"

export type DeleteOrganizationProps = {
  localization: Pick<
    OrganizationLocalization,
    | "deleteOrganization"
    | "deleteOrganizationDescription"
    | "organizationDeleted"
  >
}

export function DeleteOrganization(props: DeleteOrganizationProps) {
  const auth = useAuth()
  const [confirmOpen, setConfirmOpen] = createSignal(false)
  const activeOrganization = useActiveOrganization(
    auth.authClient as OrganizationAuthClient
  )
  const permission = useHasPermission(
    auth.authClient as OrganizationAuthClient,
    {
      permissions: { organization: ["delete"] }
    }
  )

  return (
    <Show
      when={!permission.isPending}
      fallback={
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="grid gap-1">
            <Skeleton class="h-4 w-36 rounded-md" />
            <Skeleton class="h-3 w-64 rounded-md" />
          </div>
          <Skeleton class="h-8 w-32 rounded-md" />
        </div>
      }
    >
      <Show when={permission.data?.success}>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-medium text-sm leading-tight">
              {props.localization.deleteOrganization}
            </p>
            <p class="mt-0.5 text-muted-foreground text-xs">
              {props.localization.deleteOrganizationDescription}
            </p>
          </div>

          <Button
            class="text-destructive"
            disabled={!activeOrganization.data}
            onClick={() => setConfirmOpen(true)}
            size="sm"
            type="button"
            variant="outline"
          >
            {props.localization.deleteOrganization}
          </Button>

          <Show when={activeOrganization.data}>
            {(organization) => (
              <DeleteOrganizationDialog
                localization={props.localization}
                onOpenChange={setConfirmOpen}
                open={confirmOpen()}
                organization={organization()}
              />
            )}
          </Show>
        </div>
      </Show>
    </Show>
  )
}
