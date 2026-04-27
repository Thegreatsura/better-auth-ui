"use client"

import {
  type AdditionalField as AdditionalFieldConfig,
  resolveInputType
} from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronDownIcon, Copy } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type AdditionalFieldProps = {
  name: string
  field: AdditionalFieldConfig
  isPending?: boolean
}

/** Convert a `defaultValue` into a `Date` for the calendar. */
function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value
  if (typeof value === "string") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }
  return undefined
}

/** Format a Date as `HH:mm:ss` for an `<input type="time">`. */
function formatTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** Icon-only copy button used as an `InputGroupAddon`. */
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
    } catch {
      // ignore — clipboard API unavailable
    }
  }

  return (
    <InputGroupButton
      aria-label={localization.settings.copyToClipboard}
      title={localization.settings.copyToClipboard}
      onClick={handleCopy}
      disabled={isDisabled || !value}
    >
      {copied ? <Check /> : <Copy />}
    </InputGroupButton>
  )
}

/** Renders a single additional user field via shadcn primitives. */
export function AdditionalField({
  name,
  field,
  isPending
}: AdditionalFieldProps) {
  const inputType = resolveInputType(field)

  if (inputType === "textarea") {
    return (
      <Field>
        <Label htmlFor={name}>{field.label}</Label>

        <Textarea
          id={name}
          name={name}
          defaultValue={field.defaultValue as string}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={field.readOnly}
          disabled={isPending}
        />

        <FieldError />
      </Field>
    )
  }

  if (inputType === "number") {
    return (
      <Field>
        <Label htmlFor={name}>{field.label}</Label>

        <Input
          id={name}
          name={name}
          type="number"
          defaultValue={field.defaultValue as number | string | undefined}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={field.readOnly}
          disabled={isPending}
        />

        <FieldError />
      </Field>
    )
  }

  if (inputType === "switch") {
    return (
      <Field orientation="horizontal">
        <Switch
          id={name}
          name={name}
          defaultChecked={Boolean(field.defaultValue)}
          disabled={isPending || field.readOnly}
        />

        <FieldContent>
          <FieldLabel htmlFor={name}>{field.label}</FieldLabel>
        </FieldContent>
      </Field>
    )
  }

  if (inputType === "checkbox") {
    return (
      <Field orientation="horizontal">
        <Checkbox
          id={name}
          name={name}
          defaultChecked={Boolean(field.defaultValue)}
          required={field.required}
          disabled={isPending || field.readOnly}
        />

        <FieldContent>
          <FieldLabel htmlFor={name}>{field.label}</FieldLabel>
        </FieldContent>
      </Field>
    )
  }

  if (inputType === "select") {
    return (
      <Field>
        <Label htmlFor={name}>{field.label}</Label>

        <Select
          name={name}
          defaultValue={
            field.defaultValue != null ? String(field.defaultValue) : undefined
          }
          required={field.required}
          disabled={isPending || field.readOnly}
        >
          <SelectTrigger id={name} className="w-full">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>

          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FieldError />
      </Field>
    )
  }

  if (inputType === "combobox") {
    return (
      <Field>
        <Label htmlFor={name}>{field.label}</Label>

        <Combobox
          items={field.options ?? []}
          name={name}
          defaultValue={
            field.defaultValue != null ? String(field.defaultValue) : undefined
          }
          required={field.required}
          disabled={isPending || field.readOnly}
        >
          <ComboboxInput placeholder={field.placeholder} id={name} />

          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>

            <ComboboxList>
              {(option) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <FieldError />
      </Field>
    )
  }

  if (inputType === "date" || inputType === "datetime") {
    return <DateInput name={name} field={field} isPending={isPending} />
  }

  // inputType === "input"
  const hasPrefix = field.prefix != null
  const hasSuffix = field.suffix != null || field.copyable

  if (hasPrefix || hasSuffix) {
    return (
      <Field>
        <Label htmlFor={name}>{field.label}</Label>

        <InputGroup>
          {hasPrefix && (
            <InputGroupAddon align="inline-start">
              {field.prefix}
            </InputGroupAddon>
          )}

          <InputGroupInput
            id={name}
            name={name}
            defaultValue={field.defaultValue as string}
            placeholder={field.placeholder}
            required={field.required}
            readOnly={field.readOnly}
            disabled={isPending}
          />

          {field.copyable ? (
            <InputGroupAddon align="inline-end">
              <CopyButton
                value={field.defaultValue as string | undefined}
                isDisabled={isPending}
              />
            </InputGroupAddon>
          ) : (
            field.suffix != null && (
              <InputGroupAddon align="inline-end">
                {field.suffix}
              </InputGroupAddon>
            )
          )}
        </InputGroup>

        <FieldError />
      </Field>
    )
  }

  return (
    <Field>
      <Label htmlFor={name}>{field.label}</Label>

      <Input
        id={name}
        name={name}
        defaultValue={field.defaultValue as string}
        placeholder={field.placeholder}
        required={field.required}
        readOnly={field.readOnly}
        disabled={isPending}
      />

      <FieldError />
    </Field>
  )
}

/**
 * Date / datetime input. Composes `Popover` + `Calendar` for the date and
 * (optionally) `<input type="time">` for the time. Submits the combined ISO
 * value via a hidden `<input>` so it shows up in `FormData`.
 */
function DateInput({ name, field, isPending }: AdditionalFieldProps) {
  const { localization } = useAuth()
  const inputType = resolveInputType(field)
  const isDateTime = inputType === "datetime"

  const [date, setDate] = useState<Date | undefined>(toDate(field.defaultValue))
  const [time, setTime] = useState<string>(
    isDateTime && date ? formatTime(date) : ""
  )
  const [open, setOpen] = useState(false)

  // Compose the hidden form value: ISO date for "date", ISO datetime for
  // "datetime" (date + time).
  let formValue = ""
  if (date) {
    if (isDateTime) {
      const [h = "0", m = "0", s = "0"] = (time || "00:00:00").split(":")
      const combined = new Date(date)
      combined.setHours(Number(h), Number(m), Number(s), 0)
      formValue = combined.toISOString()
    } else {
      formValue = format(date, "yyyy-MM-dd")
    }
  }

  return (
    <Field>
      <Label htmlFor={`${name}-date`}>{field.label}</Label>

      <input type="hidden" name={name} value={formValue} />

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id={`${name}-date`}
              data-empty={!date}
              disabled={isPending || field.readOnly}
              className={cn(
                "flex-1 justify-between font-normal",
                "data-[empty=true]:text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>{field.placeholder}</span>}

              {isDateTime ? <ChevronDownIcon /> : <CalendarIcon />}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              captionLayout="dropdown"
              onSelect={(value) => {
                setDate(value)
                if (!isDateTime) setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        {isDateTime && (
          <Field className="w-32">
            <Label htmlFor={`${name}-time`} className="sr-only">
              {localization.settings.time}
            </Label>

            <Input
              type="time"
              id={`${name}-time`}
              step="1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isPending || field.readOnly}
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        )}
      </div>

      <FieldError />
    </Field>
  )
}
