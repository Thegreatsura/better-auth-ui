import {
  type UsernameAuthClient,
  useAuth,
  useAuthPlugin,
  useIsUsernameAvailable
} from "@better-auth-ui/react"
import { Check, Xmark } from "@gravity-ui/icons"
import {
  FieldError,
  InputGroup,
  Label,
  Spinner,
  TextField
} from "@heroui/react"
import { useDebouncer } from "@tanstack/react-pacer"
import { useState } from "react"

import type { AdditionalFieldRenderProps } from "../../../lib/auth-plugin"
import { usernamePlugin } from "../../../lib/username/username-plugin"

export type UsernameFieldRendererProps = AdditionalFieldRenderProps & {
  minLength?: number
  maxLength?: number
}

/** Custom renderer for username field with availability checking. */
export function UsernameFieldRenderer({
  field,
  name,
  defaultValue,
  onChange,
  currentValue = "",
  isPending,
  variant,
  error,
  minLength = 3,
  maxLength = 30
}: UsernameFieldRendererProps) {
  const { authClient } = useAuth()
  const { localization } = useAuthPlugin(usernamePlugin)
  const [value, setValue] = useState(String(defaultValue ?? ""))

  const {
    mutate: isUsernameAvailable,
    data: usernameData,
    error: usernameError,
    reset: resetUsername
  } = useIsUsernameAvailable(authClient as UsernameAuthClient)

  const usernameDebouncer = useDebouncer(
    (val: string) => {
      if (!val.trim() || val.trim() === currentValue) {
        resetUsername()
        return
      }

      isUsernameAvailable({ username: val.trim() })
    },
    { wait: 500 }
  )

  function handleChange(val: string) {
    setValue(val)
    resetUsername()
    onChange?.(val)

    usernameDebouncer.maybeExecute(val)
  }

  const isInvalid =
    !!error || !!usernameError || (usernameData && !usernameData.available)

  const showAvailabilityIndicator =
    value.trim() && value.trim() !== currentValue

  const availabilityError =
    usernameError?.error?.message ||
    usernameError?.message ||
    (usernameData?.available === false ? localization.usernameTaken : null)

  return (
    <TextField
      name={name}
      type="text"
      autoComplete="username"
      minLength={minLength}
      maxLength={maxLength}
      isDisabled={isPending}
      value={value}
      onChange={handleChange}
      isInvalid={isInvalid}
    >
      <Label>{field.label}</Label>

      <InputGroup variant={variant === "transparent" ? "primary" : "secondary"}>
        <InputGroup.Input
          placeholder={localization.usernamePlaceholder}
          required={field.required}
        />

        {showAvailabilityIndicator && (
          <InputGroup.Suffix className="px-2">
            {usernameData?.available ? (
              <Check className="text-success" />
            ) : usernameError || usernameData?.available === false ? (
              <Xmark className="text-danger" />
            ) : (
              <Spinner size="sm" color="current" />
            )}
          </InputGroup.Suffix>
        )}
      </InputGroup>

      <FieldError>{error || availabilityError}</FieldError>
    </TextField>
  )
}
