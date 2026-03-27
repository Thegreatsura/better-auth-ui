import { useAuth, useSession, useUpdateUser } from "@better-auth-ui/react"
import {
  Button,
  Card,
  type CardProps,
  cn,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Skeleton,
  Spinner,
  TextField,
  toast
} from "@heroui/react"
import type { SyntheticEvent } from "react"
import { UserAvatar } from "../../user/user-avatar"

export type UserProfileProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Render a profile card that lets the authenticated user view and update their display name.
 *
 * The component uses auth localization for labels, reflects session loading state with skeletons, shows the best-available user identifier (display username, name, or email), and wires the form submission to the user update action from auth hooks.
 *
 * @returns A JSX element containing the user profile card and an editable name form
 */
export function UserProfile({
  className,
  variant,
  ...props
}: UserProfileProps & CardProps) {
  const { localization } = useAuth()
  const { data: sessionData } = useSession()

  const { mutate: updateUser, isPending } = useUpdateUser({
    onError: (error) => toast.danger(error.error?.message || error.message),
    onSuccess: () => toast.success(localization.settings.profileUpdatedSuccess)
  })

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    updateUser({ name: formData.get("name") as string })
  }

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {localization.settings.profile}
      </h2>

      <Card className={cn("p-4 gap-4", className)} variant={variant} {...props}>
        <Card.Content>
          <Label isDisabled={!sessionData}>
            {localization.settings.avatar}
          </Label>

          <Form onSubmit={handleSubmit}>
            <Fieldset className="w-full gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  isIconOnly
                  variant="ghost"
                  className="p-0 h-auto w-auto rounded-full"
                  isDisabled={!sessionData}
                >
                  <UserAvatar size="lg" />
                </Button>

                <Button isDisabled={!sessionData} size="sm" variant="secondary">
                  {localization.settings.changeAvatar}
                </Button>
              </div>

              <Fieldset.Group>
                <TextField
                  key={sessionData?.user?.name}
                  name="name"
                  defaultValue={sessionData?.user?.name}
                  isDisabled={isPending || !sessionData}
                >
                  <Label>{localization.auth.name}</Label>

                  {sessionData ? (
                    <Input
                      autoComplete="name"
                      placeholder={localization.auth.name}
                      variant={
                        variant === "transparent" ? "primary" : "secondary"
                      }
                    />
                  ) : (
                    <Skeleton className="h-10 md:h-9 w-full rounded-xl" />
                  )}

                  <FieldError />
                </TextField>
              </Fieldset.Group>

              <Fieldset.Actions>
                <Button
                  type="submit"
                  isPending={isPending}
                  isDisabled={!sessionData}
                  size="sm"
                >
                  {isPending && <Spinner color="current" size="sm" />}
                  {localization.settings.saveChanges}
                </Button>
              </Fieldset.Actions>
            </Fieldset>
          </Form>
        </Card.Content>
      </Card>
    </div>
  )
}
