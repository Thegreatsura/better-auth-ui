/** Data type of the additional field. */
export type AdditionalFieldType = "string" | "number" | "boolean" | "date"

/** UI rendering choice. Default is inferred from `AdditionalField.type`. */
export type AdditionalFieldInputType =
  | "input"
  | "textarea"
  | "number"
  | "slider"
  | "switch"
  | "checkbox"
  | "select"
  | "combobox"
  | "date"
  | "datetime"
  | "hidden"

/**
 * Augmentation target for widening `AdditionalField.label` in UI packages.
 *
 * @example
 * declare module "@better-auth-ui/core" {
 *   interface AdditionalFieldRegister { label: ReactNode }
 * }
 */
// biome-ignore lint/suspicious/noEmptyInterface: augmentation target
export interface AdditionalFieldRegister {}

/** Resolved label type. Defaults to `string`. */
export type AdditionalFieldLabel = AdditionalFieldRegister extends {
  label: infer L
}
  ? L
  : string

/** Option for a `select` input. */
export interface AdditionalFieldOption {
  label: AdditionalFieldLabel
  value: string
}

/** Configuration for a single additional user field. */
export interface AdditionalField {
  /** Field name. Used as the user object key and form input `name`. */
  name: string
  /** Data type of the field. */
  type: AdditionalFieldType
  /** Visible label rendered next to the input. */
  label: AdditionalFieldLabel
  /** Override the default UI rendering. @default inferred from `type` */
  inputType?: AdditionalFieldInputType
  /** Placeholder text. */
  placeholder?: string
  /** Content rendered as a prefix addon inside the input group. */
  prefix?: AdditionalFieldLabel
  /** Content rendered as a suffix addon inside the input group. */
  suffix?: AdditionalFieldLabel
  /**
   * `Intl.NumberFormat` options for number fields. Use `maximumFractionDigits`
   * (and optionally `minimumFractionDigits`) to allow decimals, or `style: "currency"`
   * / `style: "percent"` for richer formatting.
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Minimum value. Applies to `number` and `slider` input types. */
  min?: number
  /** Maximum value. Applies to `number` and `slider` input types. */
  max?: number
  /** Step value. Applies to `number` and `slider` input types. */
  step?: number
  /** @default false */
  required?: boolean
  /** Default value used to seed the input on the sign-up form only. */
  defaultValue?: string | number | boolean | Date
  /**
   * Render the field but exclude it from submission payloads.
   * @default false
   */
  readOnly?: boolean
  /**
   * Show a copy-to-clipboard button as a suffix. Input variant only.
   * @default false
   */
  copyable?: boolean
  /** Options for the select input type. */
  options?: AdditionalFieldOption[]
  /**
   * Custom client-side validation. Return `true` (or anything truthy) when
   * valid, or throw an `Error` (the `message` is shown to the user) when
   * invalid.
   *
   * Receives the parsed value (after `parseAdditionalFieldValue`).
   */
  validate?: (
    value: string | number | boolean | Date | undefined
  ) => boolean | Promise<boolean>
  /** Render on the sign-up form. @default false */
  signUp?: boolean
  /** Render on the user profile. @default true */
  profile?: boolean
}

/** Ordered list of `AdditionalField` configurations. */
export type AdditionalFields = AdditionalField[]

/**
 * Convert a raw form value into the JS value Better Auth expects for the
 * given field. Returns `undefined` when the value is empty or unparseable.
 */
export function parseAdditionalFieldValue(
  field: AdditionalField,
  raw: string | null | undefined
): string | number | boolean | Date | undefined {
  if (field.type === "boolean") {
    // FormData: checked checkbox/switch sends "on"; unchecked sends nothing.
    return raw === "on" || raw === "true"
  }

  if (!raw) return undefined

  if (field.type === "number") {
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  if (field.type === "date") {
    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }

  return raw
}

/** Resolve the effective `inputType`, defaulting based on `field.type`. */
export function resolveInputType(
  field: AdditionalField
): AdditionalFieldInputType {
  if (field.inputType) return field.inputType

  switch (field.type) {
    case "number":
      return "number"
    case "boolean":
      return "switch"
    case "date":
      return "date"
    default:
      return "input"
  }
}
