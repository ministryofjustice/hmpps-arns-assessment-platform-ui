import { BlockType, JourneyDefinition } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { FieldBlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { FieldConfig, FieldType, FormConfig, FormConfigOption } from './port'

const FIELD_TYPE_BY_VARIANT: Record<string, FieldType> = {
  govukTextInput: FieldType.TEXT,
  govukPasswordInput: FieldType.TEXT,
  govukTextarea: FieldType.TEXT_AREA,
  govukCharacterCount: FieldType.TEXT_AREA,
  govukRadioInput: FieldType.RADIO,
  govukCheckboxInput: FieldType.CHECKBOX,
  govukSelectInput: FieldType.DROPDOWN,
  govukDateInputFull: FieldType.DATE,
  govukDateInputYearMonth: FieldType.DATE,
  govukDateInputMonthDay: FieldType.DATE,
}

const isFieldBlock = (node: unknown): node is FieldBlockDefinition & { code: string } =>
  typeof node === 'object' &&
  node !== null &&
  (node as { blockType?: unknown }).blockType === BlockType.FIELD &&
  typeof (node as { code?: unknown }).code === 'string'

const optionsFrom = (block: FieldBlockDefinition): FormConfigOption[] => {
  const items = (block as { items?: unknown }).items
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .filter((item): item is { value: string } => typeof item === 'object' && typeof item?.value === 'string')
    .map(item => ({ value: item.value }))
}

/**
 * Recursively walks a journey/step/block subtree looking for field blocks,
 * however deeply they're nested (e.g. behind a radio item's conditional
 * `block`, or a template's `slots`). Anything without a `blockType` of
 * `BlockType.FIELD` and a string `code` is just descended into further.
 */
const collectFields = (node: unknown, section: string | undefined, fields: Record<string, FieldConfig>): void => {
  if (Array.isArray(node)) {
    node.forEach(item => collectFields(item, section, fields))
    return
  }

  if (typeof node !== 'object' || node === null) {
    return
  }

  if (isFieldBlock(node)) {
    fields[node.code] = {
      code: node.code,
      type: FIELD_TYPE_BY_VARIANT[node.variant] ?? FieldType.TEXT,
      options: optionsFrom(node),
      section,
    }
  }

  Object.values(node).forEach(value => collectFields(value, section, fields))
}

const collectJourneyFields = (journey: JourneyDefinition, fields: Record<string, FieldConfig>): void => {
  journey.steps?.forEach(step => collectFields(step.blocks, journey.code, fields))
  journey.children?.forEach(child => collectJourneyFields(child, fields))
}

export const formConfigFromJourney = (journey: JourneyDefinition): FormConfig => {
  const version = journey.data?.formVersion
  if (typeof version !== 'string') {
    throw new Error(`Journey '${journey.code}' has no string 'formVersion' set in its data`)
  }

  const fields: Record<string, FieldConfig> = {}
  collectJourneyFields(journey, fields)

  return { version, fields }
}
