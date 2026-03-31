"use client"

import { useAuth, useSession, useUpdateUser } from "@better-auth-ui/react"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { ChangeAvatar } from "./change-avatar"

export type UserProfileProps = {
  className?: string
}

/**
 * Render a profile card that lets the authenticated user view and update their display name and avatar.
 *
 * @param className - Optional additional CSS class names applied to the card container
 * @returns A JSX element containing the profile card with avatar upload and editable name field
 */
export function UserProfile({ className }: UserProfileProps) {
  const { localization } = useAuth()
  const { data: sessionData } = useSession()

  const { mutate: updateUser, isPending } = useUpdateUser({
    onError: (error) => toast.error(error.error?.message || error.message),
    onSuccess: () => toast.success(localization.settings.profileUpdatedSuccess)
  })

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
  }>({})

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    updateUser({ name: formData.get("name") as string })
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        {localization.settings.profile}
      </h2>

      <form onSubmit={handleSubmit}>
        <Card className={cn(className)}>
          <CardContent className="grid gap-4">
            <ChangeAvatar />

            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="name">{localization.auth.name}</FieldLabel>

              {sessionData ? (
                <Input
                  key={sessionData?.user?.name}
                  id="name"
                  name="name"
                  autoComplete="name"
                  defaultValue={sessionData?.user?.name}
                  placeholder={localization.auth.name}
                  disabled={isPending}
                  required
                  onChange={() => {
                    setFieldErrors((prev) => ({
                      ...prev,
                      name: undefined
                    }))
                  }}
                  onInvalid={(e) => {
                    e.preventDefault()
                    setFieldErrors((prev) => ({
                      ...prev,
                      name: (e.target as HTMLInputElement).validationMessage
                    }))
                  }}
                  aria-invalid={!!fieldErrors.name}
                />
              ) : (
                <Skeleton className="h-8 w-full" />
              )}

              <FieldError>{fieldErrors.name}</FieldError>
            </Field>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !sessionData}
            >
              {isPending && <Spinner />}

              {localization.settings.saveChanges}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
