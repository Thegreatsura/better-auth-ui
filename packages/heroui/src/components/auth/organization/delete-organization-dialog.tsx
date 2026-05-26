import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useDeleteOrganization
} from "@better-auth-ui/react"
import { TriangleExclamation } from "@gravity-ui/icons"
import { AlertDialog, Button, Form, Spinner, toast } from "@heroui/react"
import type { SyntheticEvent } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

export type DeleteOrganizationDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
}

export function DeleteOrganizationDialog({
  isOpen,
  onOpenChange,
  organizationId
}: DeleteOrganizationDialogProps) {
  const { authClient, basePaths, localization, navigate } = useAuth()
  const {
    localization: organizationLocalization,
    viewPaths: organizationPluginViewPaths
  } = useAuthPlugin(organizationPlugin)

  const { mutate: deleteOrganization, isPending } = useDeleteOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        onOpenChange(false)
        toast.success(organizationLocalization.organizationDeleted)

        const organizationsSettingsSegment =
          organizationPluginViewPaths.settings?.organizations ?? "organizations"

        navigate({
          to: `${basePaths.settings}/${organizationsSettingsSegment}`,
          replace: true
        })
      }
    }
  )

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    deleteOrganization({ organizationId })
  }

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <Form onSubmit={handleSubmit}>
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger">
                <TriangleExclamation />
              </AlertDialog.Icon>

              <AlertDialog.Heading>
                {organizationLocalization.deleteOrganization}
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <p className="text-muted text-sm">
                {organizationLocalization.deleteOrganizationWarning}
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary" isDisabled={isPending}>
                {localization.settings.cancel}
              </Button>

              <Button type="submit" variant="danger" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {organizationLocalization.deleteOrganization}
              </Button>
            </AlertDialog.Footer>
          </Form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  )
}
