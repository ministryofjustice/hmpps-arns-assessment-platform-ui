import {
  BlockDefinition,
  ResolvableBoolean,
  ResolvableString,
  FieldBlockDefinition,
} from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { scenarioFieldSchema, ScenarioFieldKey } from '../../scenarios'

/**
 * RandomizableField wrapper around a form field.
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
export interface RandomizableField extends BlockDefinition {
  /**
   * The field to wrap with randomization controls.
   * Can be any field type (text input, select, etc.)
   */
  field: FieldBlockDefinition

  /**
   * The field key from the scenario schema.
   * Used to generate the randomize checkbox name.
   */
  fieldKey: ResolvableString

  /**
   * Whether randomization is currently enabled for this field.
   * When true, the field input will be disabled.
   * @default false
   */
  randomize?: ResolvableBoolean

  /**
   * Label text for the randomize checkbox/option.
   * @default 'Random'
   */
  randomizeLabel?: ResolvableString
}

/**
 * Field variants that should use the "Random" option approach instead of suffix toggle
 */
const RADIO_VARIANTS = ['govukRadioInput', 'govukCheckboxes']

/**
 * Get the accessible label for a field from the schema
 */
function getFieldLabel(fieldKey: string): string {
  const schemaEntry = scenarioFieldSchema[fieldKey as ScenarioFieldKey]

  return schemaEntry?.label ?? fieldKey
}

/**
 * Renders the RandomizableField wrapper component.
 *
 * For text inputs/selects: Shows a checkbox toggle suffix
 * For radios/checkboxes: Injects a "Random" option into the options list
 */
export const RandomizableField = nunjucksComponent<RandomizableField>('randomizableField', {
  render: props => {
    const fieldBlock = props.field.block as FieldBlockDefinition
    const fieldVariant = String(fieldBlock.variant ?? '')
    const fieldCode = String(fieldBlock.code ?? 'field')
    const fieldKey = String(props.fieldKey ?? fieldCode)
    const randomizeInputName = `${fieldKey}_randomize`
    const isRandomized = props.randomize === true
    const randomizeLabel = String(props.randomizeLabel ?? 'Random')

    // Get accessible label from schema for aria-label
    const fieldLabel = getFieldLabel(fieldKey)
    const ariaLabel = `Randomise ${fieldLabel.toLowerCase()}`

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
  ${props.field.html}
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
    ${props.field.html}
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
})
