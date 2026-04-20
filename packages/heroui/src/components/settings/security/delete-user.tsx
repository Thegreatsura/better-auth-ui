import { useAuth, useDeleteUser, useListAccounts } from "@better-auth-ui/react"
import { TriangleExclamation } from "@gravity-ui/icons"
import {
  AlertDialog,
  Button,
  Card,
  type CardProps,
  cn,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
  toast
} from "@heroui/react"
import { type SyntheticEvent, useState } from "react"

export type DeleteUserProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Danger-zone card to delete the authenticated account, with a confirmation dialog and toasts.
 */
export function DeleteUser({
  className,
  variant,
  ...props
}: DeleteUserProps & Omit<CardProps, "children">) {
  const {
    authClient,
    basePaths,
    deleteUser: deleteUserConfig,
    localization,
    navigate,
    viewPaths
  } = useAuth()

  const { data: accounts } = useListAccounts(authClient)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [password, setPassword] = useState("")

  const hasCredentialAccount = accounts?.some(
    (account) => account.providerId === "credential"
  )
  const needsPassword =
    !deleteUserConfig?.sendDeleteAccountVerification && hasCredentialAccount

  const { mutate: deleteUser, isPending } = useDeleteUser(authClient)

  const handleDialogOpenChange = (open: boolean) => {
    setConfirmOpen(open)
    setPassword("")
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = {
      ...(needsPassword ? { password } : {})
    }

    deleteUser(params, {
      onSuccess: () => {
        setConfirmOpen(false)
        setPassword("")

        if (deleteUserConfig?.sendDeleteAccountVerification) {
          toast.success(localization.settings.deleteUserVerificationSent)
        } else {
          toast.success(localization.settings.deleteUserSuccess)
          navigate({
            to: `${basePaths.auth}/${viewPaths.auth.signIn}`,
            replace: true
          })
        }
      }
    })
  }

  return (
    <Card
      className={cn("border border-danger", className)}
      variant={variant}
      {...props}
    >
      <Card.Content className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium leading-tight">
            {localization.settings.deleteUser}
          </p>

          <p className="text-muted text-xs mt-0.5">
            {localization.settings.deleteUserDescription}
          </p>
        </div>

        <AlertDialog>
          <Button
            isDisabled={!accounts}
            size="sm"
            variant="danger"
            onPress={() => setConfirmOpen(true)}
          >
            {localization.settings.deleteUser}
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
                      {localization.settings.deleteUser}
                    </AlertDialog.Heading>
                  </AlertDialog.Header>

                  <AlertDialog.Body className="overflow-visible">
                    <p className="text-muted text-sm">
                      {localization.settings.deleteUserDescription}
                    </p>

                    {needsPassword && (
                      <TextField
                        className="mt-4"
                        name="password"
                        type="password"
                        isDisabled={isPending}
                        value={password}
                        onChange={setPassword}
                      >
                        <Label>{localization.auth.password}</Label>

                        <Input
                          autoComplete="current-password"
                          placeholder={localization.auth.passwordPlaceholder}
                          required
                          variant="secondary"
                        />

                        <FieldError />
                      </TextField>
                    )}
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

                      {localization.settings.deleteUser}
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
