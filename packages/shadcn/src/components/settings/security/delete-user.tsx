"use client"

import {
  useAuth,
  useDeleteUser,
  useListAccounts
} from "@better-auth-ui/react"
import { AlertDialog } from "radix-ui"
import { TriangleAlert } from "lucide-react"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type DeleteUserProps = {
  className?: string
}

/**
 * Danger-zone card to delete the authenticated account, with a confirmation dialog and toasts.
 */
export function DeleteUser({ className }: DeleteUserProps) {
  const {
    basePaths,
    deleteUser: deleteUserConfig,
    localization,
    navigate,
    viewPaths
  } = useAuth()

  const { data: accounts } = useListAccounts()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [password, setPassword] = useState("")

  const hasCredentialAccount = accounts?.some(
    (account) => account.providerId === "credential"
  )
  const needsPassword =
    !deleteUserConfig?.sendDeleteAccountVerification && hasCredentialAccount

  const { mutate: deleteUser, isPending } = useDeleteUser()

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
      },
      onError: (error) => {
        toast.error(error.error?.message || error.message)
      }
    })
  }

  return (
    <Card className={cn("border-destructive", className)}>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium leading-tight">
            {localization.settings.deleteUser}
          </p>

          <p className="text-muted-foreground text-xs mt-0.5">
            {localization.settings.deleteUserDescription}
          </p>
        </div>

        <AlertDialog.Root
          open={confirmOpen}
          onOpenChange={handleDialogOpenChange}
        >
          <AlertDialog.Trigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={!accounts}
            >
              {localization.settings.deleteUser}
            </Button>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-md">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <TriangleAlert className="size-4" />
                    </div>

                    <AlertDialog.Title className="text-base font-semibold">
                      {localization.settings.deleteUser}
                    </AlertDialog.Title>
                  </div>

                  <AlertDialog.Description className="text-sm text-muted-foreground">
                    {localization.settings.deleteUserDescription}
                  </AlertDialog.Description>
                </div>

                {needsPassword && (
                  <Field className="mt-4">
                    <FieldLabel htmlFor="delete-password">
                      {localization.auth.password}
                    </FieldLabel>

                    <Input
                      id="delete-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder={localization.auth.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                      required
                    />

                    <FieldError />
                  </Field>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <AlertDialog.Cancel asChild>
                    <Button variant="outline" disabled={isPending}>
                      {localization.settings.cancel}
                    </Button>
                  </AlertDialog.Cancel>

                  <Button type="submit" variant="destructive" disabled={isPending}>
                    {isPending && <Spinner />}
                    {localization.settings.deleteUser}
                  </Button>
                </div>
              </form>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </CardContent>
    </Card>
  )
}
