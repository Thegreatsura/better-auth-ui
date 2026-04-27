import {
  type AdditionalFieldInputType,
  parseAdditionalFieldValue
} from "@better-auth-ui/core"
import {
  type UsernameAuthClient,
  useAuth,
  useIsUsernameAvailable,
  useSession,
  useUpdateUser
} from "@better-auth-ui/react"
import { Check, Xmark } from "@gravity-ui/icons"
import {
  Button,
  Card,
  type CardProps,
  cn,
  FieldError,
  Fieldset,
  Form,
  Input,
  InputGroup,
  Label,
  Skeleton,
  Spinner,
  TextField,
  toast
} from "@heroui/react"
import { useDebouncer } from "@tanstack/react-pacer"
import { type SyntheticEvent, useEffect, useState } from "react"

import { AdditionalField } from "../../auth/additional-field"
import { ChangeAvatar } from "./change-avatar"

export type UserProfileProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Render a profile card that lets the authenticated user view and update their display name, username, and avatar.
 *
 * @returns A JSX element containing the user profile card with avatar upload and editable form fields
 */
export function UserProfile({
  className,
  variant,
  ...props
}: UserProfileProps & Omit<CardProps, "children">) {
  const {
    additionalFields,
    authClient,
    localization,
    username: usernameConfig
  } = useAuth()
  const { data: session } = useSession(authClient as UsernameAuthClient)

  const currentUsername =
    (usernameConfig?.displayUsername
      ? session?.user?.displayUsername
      : session?.user?.username) || ""

  const [username, setUsername] = useState(currentUsername)

  useEffect(() => {
    setUsername(currentUsername)
  }, [currentUsername])

  const {
    mutate: isUsernameAvailable,
    data: usernameData,
    error: usernameError,
    reset: resetUsername
  } = useIsUsernameAvailable(authClient as UsernameAuthClient)

  const usernameDebouncer = useDebouncer(
    (value: string) => {
      if (!value.trim() || value.trim() === currentUsername) {
        resetUsername()
        return
      }

      isUsernameAvailable({ username: value.trim() })
    },
    { wait: 500 }
  )

  function handleUsernameChange(value: string) {
    setUsername(value)
    resetUsername()

    if (usernameConfig?.isUsernameAvailable) {
      usernameDebouncer.maybeExecute(value)
    }
  }

  const { mutate: updateUser, isPending } = useUpdateUser(authClient, {
    onSuccess: () => toast.success(localization.settings.profileUpdatedSuccess)
  })

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string

    const additionalFieldValues: Record<string, unknown> = {}

    for (const field of additionalFields ?? []) {
      if (field.profile === false || field.readOnly) continue
      const value = parseAdditionalFieldValue(
        field,
        formData.get(field.name) as string | null
      )

      if (value !== undefined) {
        additionalFieldValues[field.name] = value
      }
    }

    updateUser({
      name,
      ...(usernameConfig?.enabled
        ? {
            username: username.trim(),
            ...(usernameConfig.displayUsername
              ? { displayUsername: username.trim() }
              : {})
          }
        : {}),
      ...additionalFieldValues
    })
  }

  return (
    <div>
      <h2 className={cn("text-sm font-semibold mb-3")}>
        {localization.settings.profile}
      </h2>

      <Card className={cn("p-4 gap-4", className)} variant={variant} {...props}>
        <Card.Content>
          <Form onSubmit={handleSubmit}>
            <Fieldset className="w-full gap-4">
              <ChangeAvatar />

              <Fieldset.Group>
                {usernameConfig?.enabled && (
                  <TextField
                    type="text"
                    autoComplete="username"
                    minLength={usernameConfig.minUsernameLength}
                    maxLength={usernameConfig.maxUsernameLength}
                    isDisabled={isPending || !session}
                    value={username}
                    onChange={handleUsernameChange}
                    isInvalid={
                      !!usernameError ||
                      (usernameData && !usernameData.available)
                    }
                  >
                    <Label>{localization.auth.username}</Label>

                    {session ? (
                      <InputGroup
                        variant={
                          variant === "transparent" ? "primary" : "secondary"
                        }
                      >
                        <InputGroup.Input
                          placeholder={localization.auth.usernamePlaceholder}
                          name="username"
                        />

                        {usernameConfig.isUsernameAvailable &&
                          username.trim() &&
                          username.trim() !== currentUsername && (
                            <InputGroup.Suffix className="px-2">
                              {usernameData?.available ? (
                                <Check className="text-success" />
                              ) : usernameError ||
                                usernameData?.available === false ? (
                                <Xmark className="text-danger" />
                              ) : (
                                <Spinner size="sm" color="current" />
                              )}
                            </InputGroup.Suffix>
                          )}
                      </InputGroup>
                    ) : (
                      <Skeleton className="h-10 md:h-9 w-full rounded-xl" />
                    )}

                    <FieldError>
                      {usernameError?.error?.message ||
                        usernameError?.message ||
                        (usernameData?.available === false &&
                          localization.auth.usernameTaken)}
                    </FieldError>
                  </TextField>
                )}

                <TextField
                  key={session?.user?.name}
                  name="name"
                  defaultValue={session?.user.name}
                  isDisabled={isPending || !session}
                >
                  <Label>{localization.auth.name}</Label>

                  {session ? (
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

                {additionalFields
                  ?.filter((field) => field.profile !== false)
                  .map((field) => {
                    const value = (session?.user as Record<string, unknown>)[
                      field.name
                    ]

                    // Re-mount when the session value loads so the field's
                    // uncontrolled `defaultValue` reflects the latest data.
                    const key = `${field.name}:${
                      value instanceof Date
                        ? value.toISOString()
                        : String(value ?? "")
                    }`

                    return session ? (
                      <AdditionalField
                        key={key}
                        name={field.name}
                        field={{
                          ...field,
                          defaultValue: value as AdditionalFieldInputType
                        }}
                        isPending={isPending}
                        variant={variant}
                      />
                    ) : (
                      <Skeleton
                        key={field.name}
                        className="h-10 md:h-9 w-full rounded-xl"
                      />
                    )
                  })}
              </Fieldset.Group>

              <Fieldset.Actions>
                <Button
                  type="submit"
                  isPending={isPending}
                  isDisabled={!session}
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
