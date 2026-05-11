import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useDeleteOrganization,
  useGetActiveOrganization
} from "@better-auth-ui/react"
import { TriangleExclamation } from "@gravity-ui/icons"
import {
  AlertDialog,
  Button,
  Card,
  type CardProps,
  Form,
  Spinner,
  toast
} from "@heroui/react"
import { type SyntheticEvent, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

export type DeleteOrganizationProps = {
  className?: string
  variant?: CardProps["variant"]
}

type ActiveOrganization = {
  id: string
  name: string
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
  const { authClient, basePaths, localization, navigate } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { viewPaths: organizationPluginViewPaths } =
    useAuthPlugin(organizationPlugin)

  const { data: activeOrganizationData } = useGetActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const activeOrganization = activeOrganizationData as
    | ActiveOrganization
    | null
    | undefined

  const [confirmOpen, setConfirmOpen] = useState(false)

  const { mutate: deleteOrganization, isPending } = useDeleteOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        setConfirmOpen(false)
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

  function handleDialogOpenChange(open: boolean) {
    setConfirmOpen(open)
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeOrganization) return

    deleteOrganization({
      organizationId: activeOrganization.id
    })
  }

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

          <AlertDialog.Backdrop
            isOpen={confirmOpen}
            onOpenChange={handleDialogOpenChange}
          >
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
                    <Button
                      slot="close"
                      variant="tertiary"
                      isDisabled={isPending}
                    >
                      {localization.settings.cancel}
                    </Button>

                    <Button
                      type="submit"
                      variant="danger"
                      isPending={isPending}
                    >
                      {isPending && <Spinner color="current" size="sm" />}

                      {organizationLocalization.deleteOrganization}
                    </Button>
                  </AlertDialog.Footer>
                </Form>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </Card.Content>
    </Card>
  )
}
