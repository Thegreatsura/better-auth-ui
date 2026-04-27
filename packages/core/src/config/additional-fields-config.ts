/** Data type of the additional field. */
export type AdditionalFieldType = "string" | "number" | "date"

/** UI rendering choice. Default is inferred from `AdditionalField.type`. */
export type AdditionalFieldInputType =
  | "input"
  | "textarea"
  | "number"
  | "date"
  | "datetime"

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
  /** @default false */
  required?: boolean
  /** Default value used to seed the input on the sign-up form only. */
  defaultValue?: string | number | Date
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
): string | number | Date | undefined {
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
    case "date":
      return "date"
    default:
      return "input"
  }
}
