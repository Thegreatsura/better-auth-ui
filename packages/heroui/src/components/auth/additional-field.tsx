import {
  type AdditionalField as AdditionalFieldConfig,
  resolveInputType
} from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import { Check, Copy } from "@gravity-ui/icons"
import {
  Button,
  Calendar,
  type CardProps,
  Checkbox,
  ComboBox,
  DateField,
  DatePicker,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
  NumberField,
  Select,
  Switch,
  TextArea,
  TextField,
  TimeField,
  type TimeValue
} from "@heroui/react"
import {
  type CalendarDate,
  type CalendarDateTime,
  fromDate,
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  toCalendarDate,
  toCalendarDateTime
} from "@internationalized/date"
import { useState } from "react"

export type AdditionalFieldProps = {
  name: string
  field: AdditionalFieldConfig
  isPending?: boolean
  variant?: CardProps["variant"]
}

/** Convert a `defaultValue` into a `CalendarDate` for HeroUI date inputs. */
function toDateValue(value: unknown): CalendarDate | undefined {
  if (value instanceof Date) {
    return toCalendarDate(fromDate(value, getLocalTimeZone()))
  }

  if (typeof value === "string") {
    try {
      return parseDate(value.slice(0, 10))
    } catch {
      return undefined
    }
  }

  return undefined
}

/** Convert a `defaultValue` into a `CalendarDateTime` for datetime inputs. */
function toDateTimeValue(value: unknown): CalendarDateTime | undefined {
  if (value instanceof Date) {
    return toCalendarDateTime(fromDate(value, getLocalTimeZone()))
  }

  if (typeof value === "string") {
    try {
      // Strip trailing `Z` or timezone offset for `parseDateTime`.
      return parseDateTime(value.replace(/(Z|[+-]\d{2}:?\d{2})$/, ""))
    } catch {
      return undefined
    }
  }

  return undefined
}

/** Icon-only copy button used as an `InputGroup.Suffix`. */
function CopyButton({
  value,
  isDisabled
}: {
  value: string | undefined
  isDisabled?: boolean
}) {
  const { localization } = useAuth()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      isIconOnly
      aria-label={localization.settings.copyToClipboard}
      size="sm"
      variant="ghost"
      isDisabled={isDisabled || !value}
      onPress={handleCopy}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}

/** Renders a single additional user field via HeroUI v3 components. */
export function AdditionalField({
  name,
  field,
  isPending,
  variant
}: AdditionalFieldProps) {
  const { localization } = useAuth()
  const inputType = resolveInputType(field)
  const inputVariant = variant === "transparent" ? "primary" : "secondary"

  if (inputType === "textarea") {
    return (
      <TextField
        name={name}
        defaultValue={field.defaultValue as string}
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
      >
        <Label>{field.label}</Label>

        <TextArea placeholder={field.placeholder} variant={inputVariant} />

        <FieldError />
      </TextField>
    )
  }

  if (inputType === "number") {
    return (
      <NumberField
        name={name}
        defaultValue={
          typeof field.defaultValue === "number"
            ? field.defaultValue
            : parseInt(field.defaultValue as string, 10)
        }
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
        variant={inputVariant}
      >
        <Label>{field.label}</Label>

        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input placeholder={field.placeholder} />
          <NumberField.IncrementButton />
        </NumberField.Group>

        <FieldError />
      </NumberField>
    )
  }

  if (inputType === "switch") {
    return (
      <Switch
        name={name}
        defaultSelected={Boolean(field.defaultValue)}
        isDisabled={isPending}
        isReadOnly={field.readOnly}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>

        <Label>{field.label}</Label>
      </Switch>
    )
  }

  if (inputType === "checkbox") {
    return (
      <Checkbox
        name={name}
        defaultSelected={Boolean(field.defaultValue)}
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
        variant={inputVariant}
      >
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>

        <Checkbox.Content>
          <Label>{field.label}</Label>
        </Checkbox.Content>
      </Checkbox>
    )
  }

  if (inputType === "select") {
    return (
      <Select
        name={name}
        defaultSelectedKey={
          field.defaultValue != null ? String(field.defaultValue) : undefined
        }
        placeholder={field.placeholder}
        isDisabled={isPending}
        isRequired={field.required}
        variant={inputVariant}
        fullWidth
      >
        <Label>{field.label}</Label>

        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {field.options?.map((option) => (
              <ListBox.Item
                key={option.value}
                id={option.value}
                textValue={
                  typeof option.label === "string" ? option.label : option.value
                }
              >
                {option.label}

                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>

        <FieldError />
      </Select>
    )
  }

  if (inputType === "combobox") {
    return (
      <ComboBox
        name={name}
        defaultSelectedKey={
          field.defaultValue != null ? String(field.defaultValue) : undefined
        }
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
        variant={inputVariant}
        fullWidth
      >
        <Label>{field.label}</Label>

        <ComboBox.InputGroup>
          <Input placeholder={field.placeholder} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>

        <ComboBox.Popover>
          <ListBox>
            {field.options?.map((option) => (
              <ListBox.Item
                key={option.value}
                id={option.value}
                textValue={
                  typeof option.label === "string" ? option.label : option.value
                }
              >
                {option.label}

                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>

        <FieldError />
      </ComboBox>
    )
  }

  if (inputType === "date" || inputType === "datetime") {
    const isDateTime = inputType === "datetime"
    const defaultValue = isDateTime
      ? toDateTimeValue(field.defaultValue)
      : toDateValue(field.defaultValue)

    return (
      <DatePicker
        className="w-full"
        name={name}
        defaultValue={defaultValue}
        granularity={isDateTime ? "minute" : "day"}
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
      >
        {({ state }) => (
          <>
            <Label>{field.label}</Label>

            <DateField.Group variant={inputVariant} fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>

              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>

            <FieldError />

            <DatePicker.Popover className="flex flex-col gap-3">
              <Calendar
                aria-label={
                  typeof field.label === "string" ? field.label : name
                }
              >
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>

                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>

                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>

                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>

              {isDateTime && (
                <div className="flex items-center justify-between">
                  <Label>{localization.settings.time}</Label>

                  <TimeField
                    aria-label={localization.settings.time}
                    granularity="minute"
                    value={state.timeValue}
                    onChange={(v) => state.setTimeValue(v as TimeValue)}
                  >
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>
              )}
            </DatePicker.Popover>
          </>
        )}
      </DatePicker>
    )
  }

  // inputType === "input"
  if (field.copyable) {
    return (
      <TextField
        name={name}
        defaultValue={field.defaultValue as string}
        isDisabled={isPending}
        isReadOnly={field.readOnly}
        isRequired={field.required}
      >
        <Label>{field.label}</Label>

        <InputGroup variant={inputVariant}>
          <InputGroup.Input placeholder={field.placeholder} />

          <InputGroup.Suffix className="px-0">
            <CopyButton
              value={field.defaultValue as string}
              isDisabled={isPending}
            />
          </InputGroup.Suffix>
        </InputGroup>

        <FieldError />
      </TextField>
    )
  }

  return (
    <TextField
      name={name}
      defaultValue={field.defaultValue as string}
      isDisabled={isPending}
      isReadOnly={field.readOnly}
      isRequired={field.required}
    >
      <Label>{field.label}</Label>

      <Input placeholder={field.placeholder} variant={inputVariant} />

      <FieldError />
    </TextField>
  )
}
