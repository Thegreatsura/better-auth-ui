import {
  type PasskeyAuthClient,
  useAddPasskey,
  useAuth,
  useAuthPlugin,
  useListPasskeys
} from "@better-auth-ui/react"
import { Fingerprint } from "@gravity-ui/icons"
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
  Skeleton,
  Spinner,
  TextField
} from "@heroui/react"
import { type SyntheticEvent, useState } from "react"

import { passkeyPlugin } from "../../lib/passkey/passkey-plugin"
import { Passkey } from "./passkey"

export type PasskeysProps = {
  className?: string
  variant?: CardProps["variant"]
}

export function Passkeys({
  className,
  variant,
  ...props
}: PasskeysProps & Omit<CardProps, "children">) {
  const { authClient, localization } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { data: passkeys, isPending } = useListPasskeys(
    authClient as PasskeyAuthClient
  )
  const { mutate: addPasskey, isPending: isAdding } = useAddPasskey(
    authClient as PasskeyAuthClient
  )

  const [nameOpen, setNameOpen] = useState(false)
  const [name, setName] = useState("")

  const handleDialogOpenChange = (open: boolean) => {
    setNameOpen(open)
    setName("")
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    addPasskey(
      { name: name.trim() || undefined },
      {
        onSuccess: () => {
          setNameOpen(false)
          setName("")
        }
      }
    )
  }

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {passkeyLocalization.passkeys}
      </h2>

      <Card className={cn(className)} variant={variant} {...props}>
        <Card.Content className="gap-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium leading-tight">
                {passkeyLocalization.passkeysDescription}
              </p>

              <p className="text-muted text-xs mt-0.5">
                {passkeyLocalization.passkeysInstructions}
              </p>
            </div>

            <AlertDialog>
              <Button
                className="shrink-0"
                size="sm"
                isDisabled={isPending}
                onPress={() => setNameOpen(true)}
              >
                {passkeyLocalization.addPasskey}
              </Button>

              <AlertDialog.Backdrop
                isOpen={nameOpen}
                onOpenChange={handleDialogOpenChange}
              >
                <AlertDialog.Container>
                  <AlertDialog.Dialog>
                    <Form onSubmit={handleSubmit}>
                      <AlertDialog.CloseTrigger />

                      <AlertDialog.Header>
                        <AlertDialog.Icon status="default">
                          <Fingerprint />
                        </AlertDialog.Icon>

                        <AlertDialog.Heading>
                          {passkeyLocalization.addPasskey}
                        </AlertDialog.Heading>
                      </AlertDialog.Header>

                      <AlertDialog.Body className="overflow-visible">
                        <p className="text-muted text-sm">
                          {passkeyLocalization.passkeysInstructions}
                        </p>

                        <TextField
                          className="mt-4"
                          name="passkey-name"
                          isDisabled={isAdding}
                          value={name}
                          onChange={setName}
                        >
                          <Label>{passkeyLocalization.passkey}</Label>

                          <Input
                            autoFocus
                            placeholder={localization.settings.optional}
                            variant="secondary"
                          />

                          <FieldError />
                        </TextField>
                      </AlertDialog.Body>

                      <AlertDialog.Footer>
                        <Button
                          slot="close"
                          variant="tertiary"
                          isDisabled={isAdding}
                        >
                          {localization.settings.cancel}
                        </Button>

                        <Button
                          type="submit"
                          isPending={isAdding}
                        >
                          {isAdding && <Spinner color="current" size="sm" />}

                          {passkeyLocalization.addPasskey}
                        </Button>
                      </AlertDialog.Footer>
                    </Form>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </div>

          {isPending ? (
            <>
              <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
              <PasskeySkeleton />
            </>
          ) : (
            passkeys?.map((passkey) => (
              <div key={passkey.id}>
                <div className="border-b border-dashed -mx-4 md:-mx-6 my-4" />
                <Passkey passkey={passkey} />
              </div>
            ))
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

function PasskeySkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
