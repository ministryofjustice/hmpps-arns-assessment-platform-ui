import { block as blockBuilder } from '@form-engine/form/builders'
import {
  BlockDefinition,
  ConditionalBoolean,
  ConditionalString,
  EvaluatedBlock,
  FieldBlockDefinition,
} from '@form-engine/form/types/structures.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import { scenarioFieldSchema, ScenarioFieldKey } from '../../scenarios'

/**
 * Props for the RandomizableField component.
 */
export interface RandomizableFieldProps {
  /**
   * The field to wrap with randomization controls.
   * Can be any field type (text input, select, etc.)
   */
  field: FieldBlockDefinition

  /**
   * The field key from the scenario schema.
   * Used to generate the randomize checkbox name.
   */
  fieldKey: ConditionalString

  /**
   * Whether randomization is currently enabled for this field.
   * When true, the field input will be disabled.
   * @default false
   */
  randomize?: ConditionalBoolean

  /**
   * Label text for the randomize checkbox/option.
   * @default 'Random'
   */
  randomizeLabel?: ConditionalString
}

/**
 * RandomizableField component interface.
 */
export interface RandomizableField extends BlockDefinition, RandomizableFieldProps {
  variant: 'randomizableField'
}

/**
 * Field variants that should use the "Random" option approach instead of suffix toggle
 */
const RADIO_VARIANTS = ['govukRadioInput', 'govukCheckboxes']

/**
 * Renders the RandomizableField wrapper component.
 *
 * For text inputs/selects: Shows a checkbox toggle suffix
 * For radios/checkboxes: Injects a "Random" option into the options list
 */
/**
 * Get the accessible label for a field from the schema
 */
function getFieldLabel(fieldKey: string): string {
  const schemaEntry = scenarioFieldSchema[fieldKey as ScenarioFieldKey]

  return schemaEntry?.label ?? fieldKey
}

export const randomizableField = buildNunjucksComponent<RandomizableField>(
  'randomizableField',
  async (block: EvaluatedBlock<RandomizableField>): Promise<string> => {
    const fieldBlock = block.field.block as FieldBlockDefinition
    const fieldVariant = String(fieldBlock.variant ?? '')
    const fieldCode = String(fieldBlock.code ?? 'field')
    const fieldKey = String(block.fieldKey ?? fieldCode)
    const randomizeInputName = `${fieldKey}_randomize`
    const isRandomized = block.randomize === true
    const randomizeLabel = String(block.randomizeLabel ?? 'Random')

    // Get accessible label from schema for aria-label
    const fieldLabel = getFieldLabel(fieldKey)
    const ariaLabel = `Randomize ${fieldLabel.toLowerCase()}`

    const isRadioType = RADIO_VARIANTS.includes(fieldVariant)

    const wrapperAttrs = [
      'class="randomizable-field"',
      `data-field-key="${fieldKey}"`,
      `data-field-code="${fieldCode}"`,
      `data-field-type="${isRadioType ? 'radio' : 'text'}"`,
      `data-randomize-label="${randomizeLabel}"`,
      `data-field-label="${fieldLabel}"`,
      isRandomized ? 'data-randomized="true"' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const hiddenValue = isRandomized ? 'true' : 'false'

    // For radio/checkbox fields, the client JS will inject the "Random" option
    if (isRadioType) {
      return `
<randomizable-field-wrapper ${wrapperAttrs}>
  ${block.field.html}
  <input type="hidden" name="${randomizeInputName}" value="${hiddenValue}" class="randomizable-field__hidden">
</randomizable-field-wrapper>
`.trim()
    }

    // For text/select fields, use the checkbox suffix approach
    const checkboxId = `${fieldKey}-randomize-checkbox`
    const checkboxChecked = isRandomized ? 'checked' : ''

    return `
<randomizable-field-wrapper ${wrapperAttrs}>
  <div class="randomizable-field__input-wrapper">
    ${block.field.html}
    <div class="randomizable-field__suffix">
      <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <div class="govuk-checkboxes__item">
          <input
            class="govuk-checkboxes__input randomizable-field__checkbox"
            id="${checkboxId}"
            name="${randomizeInputName}_checkbox"
            type="checkbox"
            value="true"
            aria-label="${ariaLabel}"
            ${checkboxChecked}
          >
          <label class="govuk-label govuk-checkboxes__label" for="${checkboxId}">
            ${randomizeLabel}
          </label>
        </div>
      </div>
    </div>
  </div>
  <input type="hidden" name="${randomizeInputName}" value="${hiddenValue}" class="randomizable-field__hidden">
</randomizable-field-wrapper>
`.trim()
  },
)

/**
 * Creates a randomizable field wrapper around a form field.
 *
 * When the randomize checkbox is checked:
 * - The field input is disabled (visually and functionally)
 * - The hidden input value is set to "true"
 * - The field will use a random value when the scenario is loaded
 *
 * @example
 * ```typescript
 * RandomizableField({
 *   field: GovUKTextInput({ code: 'givenName', label: 'Given name' }),
 *   fieldKey: 'givenName',
 *   randomize: true,
 * })
 * ```
 */
export function RandomizableField(props: RandomizableFieldProps): RandomizableField {
  return blockBuilder<RandomizableField>({ ...props, variant: 'randomizableField' })
}
