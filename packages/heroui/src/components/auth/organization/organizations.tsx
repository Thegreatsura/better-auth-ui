import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizations
} from "@better-auth-ui/react"
import { Button, Card, type CardProps } from "@heroui/react"
import { useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationRow } from "./organization-row"
import { OrganizationsEmpty } from "./organizations-empty"
import type { OrganizationsListItem } from "./organizations-list-item"
import { OrganizationsSkeleton } from "./organizations-skeleton"

export type { OrganizationsListItem } from "./organizations-list-item"

export type OrganizationsProps = {
  variant?: CardProps["variant"]
}

/**
 * Lists organizations the user belongs to (via {@link useListOrganizations}): loading skeleton,
 * empty state with create, or a card of rows with a Manage control per organization.
 * Owns {@link CreateOrganizationDialog} open state and the create actions.
 */
export function Organizations({ variant }: OrganizationsProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: organizationsData, isPending: isLoadingOrganizations } =
    useListOrganizations(authClient as OrganizationAuthClient)

  const organizations = (organizationsData ?? []) as OrganizationsListItem[]

  const openCreate = () => setCreateOpen(true)

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="truncate text-sm font-semibold">
            {organizationLocalization.organizations}
          </h2>

          <Button
            className="shrink-0"
            size="sm"
            isDisabled={isLoadingOrganizations}
            onPress={openCreate}
          >
            {organizationLocalization.createOrganization}
          </Button>
        </div>

        <Card variant={variant}>
          <Card.Content
            className={
              !isLoadingOrganizations && organizations.length > 0
                ? "gap-0"
                : undefined
            }
          >
            {isLoadingOrganizations ? (
              <OrganizationsSkeleton />
            ) : !organizations.length ? (
              <OrganizationsEmpty onCreatePress={openCreate} />
            ) : (
              organizations.map((organization, index) => (
                <div key={organization.id}>
                  {index > 0 && (
                    <div className="-mx-4 my-4 border-b border-dashed" />
                  )}
                  <OrganizationRow organization={organization} />
                </div>
              ))
            )}
          </Card.Content>
        </Card>
      </div>

      <CreateOrganizationDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  )
}
