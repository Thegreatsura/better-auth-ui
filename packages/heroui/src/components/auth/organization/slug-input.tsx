import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCheckSlug
} from "@better-auth-ui/react"
import { Check, Xmark } from "@gravity-ui/icons"
import {
  FieldError,
  InputGroup,
  Label,
  Spinner,
  TextField,
  type TextFieldProps
} from "@heroui/react"
import { useDebouncer } from "@tanstack/react-pacer"
import { useEffect } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"

/** Props for the {@link SlugInput} component. */
export type SlugInputProps = {
  value: string
  onChange: (value: string) => void
  isDisabled?: boolean
}

/**
 * Organization slug field with debounced availability checking.
 */
export function SlugInput({
  value,
  ...props
}: SlugInputProps & TextFieldProps) {
  const { authClient } = useAuth()
  const { localization, checkSlug: checkSlugEnabled } =
    useAuthPlugin(organizationPlugin)

  const {
    mutate: checkSlug,
    data: checkSlugData,
    error: checkSlugError,
    reset: resetCheckSlug
  } = useCheckSlug(authClient as OrganizationAuthClient)

  const debouncer = useDebouncer(
    (value) => {
      if (!checkSlugEnabled || !value.trim()) return

      checkSlug({ slug: value.trim() })
    },
    { wait: 500 }
  )

  useEffect(() => {
    if (!checkSlugEnabled) return

    resetCheckSlug()
    debouncer.maybeExecute(value)
  }, [checkSlugEnabled, value, debouncer.maybeExecute, resetCheckSlug])

  return (
    <TextField id="slug" name="slug" value={value} {...props}>
      <Label>{localization.slug}</Label>

      <InputGroup variant="secondary">
        <InputGroup.Input placeholder={localization.slugPlaceholder} required />

        {checkSlugEnabled && !!value.trim() && (
          <InputGroup.Suffix className="px-2">
            {checkSlugData?.status ? (
              <Check className="text-success" />
            ) : checkSlugError ? (
              <Xmark className="text-danger" />
            ) : (
              <Spinner size="sm" color="current" />
            )}
          </InputGroup.Suffix>
        )}
      </InputGroup>

      <FieldError />
    </TextField>
  )
}
