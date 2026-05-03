import {
  type AdditionalFieldValue,
  parseAdditionalFieldValue
} from "@better-auth-ui/core"
import { useAuth, useSession, useUpdateUser } from "@better-auth-ui/react"
import {
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
  TextField,
  toast
} from "@heroui/react"
import type { SyntheticEvent } from "react"

import { AdditionalField } from "../../auth/additional-field"
import { ChangeAvatar } from "./change-avatar"

export type UserProfileProps = {
  className?: string
  variant?: CardProps["variant"]
}

/**
 * Render a profile card that lets the authenticated user view and update their
 * display name, avatar, and any plugin- or user-supplied additional fields.
 */
export function UserProfile({
  className,
  variant,
  ...props
}: UserProfileProps & Omit<CardProps, "children">) {
  const { additionalFields, authClient, localization } = useAuth()
  const { data: session } = useSession(authClient)

  const { mutate: updateUser, isPending } = useUpdateUser(authClient, {
    onSuccess: () => toast.success(localization.settings.profileUpdatedSuccess)
  })

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
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

      if (field.validate) {
        try {
          await field.validate(value)
        } catch (error) {
          toast.danger(error instanceof Error ? error.message : String(error))
          return
        }
      }

      // `null` = explicit clear (forward to backend); `undefined` = omitted.
      if (value !== undefined) {
        additionalFieldValues[field.name] = value
      }
    }

    updateUser({
      name,
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
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ChangeAvatar />

            <TextField
              key={session?.user?.name}
              name="name"
              defaultValue={session?.user.name}
              isDisabled={isPending || !session}
            >
              <Label>{localization.auth.name}</Label>

              <Input
                className={cn(!session && "hidden")}
                autoComplete="name"
                placeholder={localization.auth.name}
                variant={variant === "transparent" ? "primary" : "secondary"}
              />

              {!session && (
                <Skeleton className="h-10 md:h-9 w-full rounded-xl" />
              )}

              <FieldError />
            </TextField>

            {additionalFields
              ?.filter((field) => field.profile !== false)
              .map((field) => {
                if (!session) {
                  if (field.inputType === "hidden") {
                    return null
                  }

                  return (
                    <Skeleton
                      key={field.name}
                      className="h-10 md:h-9 w-full rounded-xl"
                    />
                  )
                }

                const value = (session.user as Record<string, unknown>)[
                  field.name
                ]

                // Re-mount when the session value loads so the field's
                // uncontrolled `defaultValue` reflects the latest data.
                const key = `${field.name}:${
                  value instanceof Date
                    ? value.toISOString()
                    : String(value ?? "")
                }`

                return (
                  <AdditionalField
                    key={key}
                    name={field.name}
                    field={{
                      ...field,
                      defaultValue: value as AdditionalFieldValue | null
                    }}
                    isPending={isPending}
                    variant={variant}
                  />
                )
              })}

            <Button
              type="submit"
              isPending={isPending}
              isDisabled={!session}
              size="sm"
              className="self-start mt-1"
            >
              {isPending && <Spinner color="current" size="sm" />}
              {localization.settings.saveChanges}
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  )
}
