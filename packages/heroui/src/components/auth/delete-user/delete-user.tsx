import { authQueryKeys } from "@better-auth-ui/core"
import {
  useAuth,
  useAuthPlugin,
  useDeleteUser,
  useListAccounts
} from "@better-auth-ui/react"
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
import { useQueryClient } from "@tanstack/react-query"
import { type SyntheticEvent, useState } from "react"

import { deleteUserPlugin } from "../../../lib/auth/delete-user-plugin"

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
  const { authClient, basePaths, localization, navigate, viewPaths } = useAuth()

  const {
    localization: deleteUserLocalization,
    sendDeleteAccountVerification
  } = useAuthPlugin(deleteUserPlugin)

  const { data: accounts } = useListAccounts(authClient)

  const queryClient = useQueryClient()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [password, setPassword] = useState("")

  const hasCredentialAccount = accounts?.some(
    (account) => account.providerId === "credential"
  )
  const needsPassword = !sendDeleteAccountVerification && hasCredentialAccount

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

        if (sendDeleteAccountVerification) {
          toast.success(deleteUserLocalization.deleteUserVerificationSent)
        } else {
          toast.success(deleteUserLocalization.deleteUserSuccess)
          queryClient.removeQueries({ queryKey: authQueryKeys.all })
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
            {deleteUserLocalization.deleteUser}
          </p>

          <p className="text-muted text-xs mt-0.5">
            {deleteUserLocalization.deleteUserDescription}
          </p>
        </div>

        <AlertDialog>
          <Button
            isDisabled={!accounts}
            size="sm"
            variant="danger"
            onPress={() => setConfirmOpen(true)}
          >
            {deleteUserLocalization.deleteUser}
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
                      {deleteUserLocalization.deleteUser}
                    </AlertDialog.Heading>
                  </AlertDialog.Header>

                  <AlertDialog.Body className="overflow-visible">
                    <p className="text-muted text-sm">
                      {deleteUserLocalization.deleteUserDescription}
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

                      {deleteUserLocalization.deleteUser}
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
