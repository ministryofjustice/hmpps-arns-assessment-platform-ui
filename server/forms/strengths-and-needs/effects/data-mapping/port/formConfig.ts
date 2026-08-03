/**
 * Port of formconfig/FormConfigProvider.kt's data shapes - the subset of the
 * form config JSON that the data mapping code depends on.
 */

export enum FieldType {
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXT_AREA = 'TEXT_AREA',
  DATE = 'DATE',
  DROPDOWN = 'DROPDOWN',
  HIDDEN = 'HIDDEN',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  COLLECTION = 'COLLECTION',
}

export interface FormConfigOption {
  value?: string | null
}

export interface FieldConfig {
  code: string
  options: FormConfigOption[]
  type: FieldType
  section?: string
}

export interface FormConfig {
  version: string
  fields: Record<string, FieldConfig>
}
