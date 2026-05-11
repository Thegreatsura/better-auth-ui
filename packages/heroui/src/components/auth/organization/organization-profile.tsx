import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useGetActiveOrganization,
  useUpdateOrganization
} from "@better-auth-ui/react"
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

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { ChangeOrganizationLogo } from "./change-organization-logo"

export type OrganizationProfileProps = {
  className?: string
  variant?: CardProps["variant"]
}

type ActiveOrganization = {
  id: string
  name: string
  slug?: string | null
  logo?: string | null
}

/**
 * Profile card for the active organization: logo (when enabled), display name, and slug.
 */
export function OrganizationProfile({
  className,
  variant,
  ...props
}: OrganizationProfileProps & Omit<CardProps, "children">) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const {
    data: activeOrganizationData,
    isPending: isActiveOrganizationPending
  } = useGetActiveOrganization(authClient as OrganizationAuthClient)

  const activeOrganization = activeOrganizationData as
    | ActiveOrganization
    | null
    | undefined

  const { mutate: commitOrganizationUpdate, isPending } = useUpdateOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () =>
        toast.success(organizationLocalization.organizationUpdatedSuccess)
    }
  )

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeOrganization) return

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    commitOrganizationUpdate({
      data: { name, slug }
    })
  }

  return (
    <div>
      <h2 className={cn("mb-3 text-sm font-semibold")}>
        {organizationLocalization.organizationProfile}
      </h2>

      <Card className={cn("gap-4 p-4", className)} variant={variant} {...props}>
        <Card.Content>
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ChangeOrganizationLogo
              isOrganizationLoading={isActiveOrganizationPending}
              organization={activeOrganization}
            />

            <TextField
              key={activeOrganization?.name}
              name="name"
              defaultValue={activeOrganization?.name}
              isDisabled={isPending || !activeOrganization}
            >
              <Label>{organizationLocalization.name}</Label>

              <Input
                className={cn(!activeOrganization && "hidden")}
                autoComplete="organization"
                placeholder={organizationLocalization.namePlaceholder}
                variant={variant === "transparent" ? "primary" : "secondary"}
              />

              {!activeOrganization && (
                <Skeleton className="h-10 w-full rounded-xl md:h-9" />
              )}

              <FieldError />
            </TextField>

            <TextField
              key={activeOrganization?.slug ?? ""}
              name="slug"
              defaultValue={activeOrganization?.slug ?? ""}
              isDisabled={isPending || !activeOrganization}
            >
              <Label>{organizationLocalization.slug}</Label>

              <Input
                className={cn(!activeOrganization && "hidden")}
                autoComplete="off"
                placeholder={organizationLocalization.slugPlaceholder}
                variant={variant === "transparent" ? "primary" : "secondary"}
              />

              {!activeOrganization && (
                <Skeleton className="h-10 w-full rounded-xl md:h-9" />
              )}

              <FieldError />
            </TextField>

            <Button
              type="submit"
              isPending={isPending}
              isDisabled={!activeOrganization}
              size="sm"
              className="mt-1 self-start"
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
