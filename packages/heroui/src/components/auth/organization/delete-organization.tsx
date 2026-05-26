import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin
} from "@better-auth-ui/react"
import { AlertDialog, Button, Card, type CardProps } from "@heroui/react"
import { useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { DeleteOrganizationDialog } from "./delete-organization-dialog"

export type DeleteOrganizationProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Danger-zone control to delete the active organization (owner permission on
 * the server).
 */
export function DeleteOrganization({
  className,
  variant,
  ...props
}: DeleteOrganizationProps & Omit<CardProps, "children">) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: activeOrganization } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <Card className={className} variant={variant} {...props}>
      <Card.Content className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium leading-tight">
            {organizationLocalization.deleteOrganization}
          </p>

          <p className="text-muted mt-0.5 text-xs">
            {organizationLocalization.deleteOrganizationWarning}
          </p>
        </div>

        <AlertDialog>
          <Button
            isDisabled={!activeOrganization}
            size="sm"
            variant="danger-soft"
            onPress={() => setConfirmOpen(true)}
          >
            {organizationLocalization.deleteOrganization}
          </Button>

          {activeOrganization && (
            <DeleteOrganizationDialog
              isOpen={confirmOpen}
              onOpenChange={setConfirmOpen}
              organizationId={activeOrganization.id}
            />
          )}
        </AlertDialog>
      </Card.Content>
    </Card>
  )
}
