import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCreateOrganization
} from "@better-auth-ui/react"
import { Briefcase } from "@gravity-ui/icons"
import {
  AlertDialog,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField
} from "@heroui/react"
import { type SyntheticEvent, useState } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

/** Props for the {@link CreateOrganizationDialog} component. */
export type CreateOrganizationDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Render a dialog for creating a new organization.
 *
 * @param isOpen - Whether the dialog is open
 * @param onOpenChange - Callback for when the dialog open state changes
 * @returns The create organization dialog as a JSX element
 */
export function CreateOrganizationDialog({
  isOpen,
  onOpenChange
}: CreateOrganizationDialogProps) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [slug, setSlug] = useState("")

  const { mutate: createOrganization, isPending: isCreating } =
    useCreateOrganization(authClient as OrganizationAuthClient, {
      onSuccess: () => {
        setSlug("")
        onOpenChange(false)
      }
    })

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const name = (formData.get("name") as string)?.trim()
    const submittedSlug = (formData.get("slug") as string)?.trim()

    if (!name) return

    createOrganization({
      name,
      slug:
        submittedSlug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slug) {
      setSlug(
        e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      )
    }
  }

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <Form onSubmit={handleSubmit}>
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="default">
                <Briefcase />
              </AlertDialog.Icon>

              <AlertDialog.Heading>
                {organizationLocalization.createOrganization}
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body className="flex flex-col gap-4 overflow-visible">
              <p className="text-muted text-sm">
                {organizationLocalization.organizationsDescription}
              </p>

              <TextField id="name" name="name" isDisabled={isCreating}>
                <Label>{organizationLocalization.name}</Label>

                <Input
                  required
                  autoFocus
                  placeholder={organizationLocalization.namePlaceholder}
                  variant="secondary"
                  onChange={handleNameChange}
                />

                <FieldError />
              </TextField>

              <TextField
                id="slug"
                name="slug"
                value={slug}
                onChange={setSlug}
                isDisabled={isCreating}
              >
                <Label>{organizationLocalization.slug}</Label>

                <Input
                  placeholder={organizationLocalization.slugPlaceholder}
                  variant="secondary"
                />

                <FieldError />
              </TextField>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary" isDisabled={isCreating}>
                {localization.settings.cancel}
              </Button>

              <Button type="submit" isPending={isCreating}>
                {isCreating && <Spinner color="current" size="sm" />}

                {organizationLocalization.createOrganization}
              </Button>
            </AlertDialog.Footer>
          </Form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  )
}
