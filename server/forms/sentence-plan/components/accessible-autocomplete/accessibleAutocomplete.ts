import { block as blockBuilder } from '@form-engine/form/builders'
import {
  BlockDefinition,
  ConditionalArray,
  ConditionalBoolean,
  ConditionalNumber,
  ConditionalString,
  EvaluatedBlock,
  FieldBlockDefinition,
} from '@form-engine/form/types/structures.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'

/**
 * Props for the AccessibleAutocomplete component.
 * @see https://github.com/alphagov/accessible-autocomplete
 */
export interface AccessibleAutocompleteProps {
  /**
   * The field to enhance with autocomplete behaviour.
   * Typically a GovUKTextInput, but can be any field type.
   * The field will be wrapped in a div with data attributes for JS initialization.
   */
  field: FieldBlockDefinition

  /**
   * Autocomplete data source.
   * Can be either:
   * - A flat array of strings: ['Option 1', 'Option 2', ...]
   * - A keyed object for dynamic filtering: { key1: ['...'], key2: ['...'] }
   * - A Data() expression that resolves to either of the above
   *
   * When using a keyed object, use `dataKeyFrom` to specify which element's
   * value determines the current key.
   */
  data: ConditionalArray<string> | Record<string, ConditionalArray<string>>

  /**
   * CSS selector for an element whose value determines the data key.
   * Only used when `data` is a keyed object.
   *
   * @example '#area-of-need-input' - Gets value from element with this ID
   */
  dataKeyFrom?: ConditionalString

  /**
   * Minimum number of characters before showing suggestions.
   * @default 2
   */
  minLength?: ConditionalNumber

  /**
   * Whether to show a "no results found" message when no options match.
   * @default false
   */
  showNoOptionsFound?: ConditionalBoolean

  /**
   * Custom CSS classes to add to the dropdown menu (ul element).
   * @default null
   */
  menuClasses?: ConditionalString

  /**
   * Custom CSS classes to add to the input element.
   * @default null
   */
  inputClasses?: ConditionalString

  /**
   * Custom CSS classes for the hint element (appears when autoselect is true).
   * Defaults to inputClasses if not specified.
   * @default null
   */
  hintClasses?: ConditionalString

  /**
   * Highlight the first option when the user types and receives results.
   * Pressing enter will select it.
   * @default false
   */
  autoselect?: ConditionalBoolean

  /**
   * Confirm the selected option when the user clicks outside the component.
   * @default true
   */
  confirmOnBlur?: ConditionalBoolean

  /**
   * How the menu should appear - inline or as an overlay.
   * @default 'inline'
   */
  displayMenu?: ConditionalString

  /**
   * Show all values when the user clicks the input (like a dropdown).
   * Renders with a dropdown arrow to convey this behaviour.
   * @default false
   */
  showAllValues?: ConditionalBoolean

  /**
   * HTML attributes to set on the menu element.
   * Useful for accessibility, e.g. { 'aria-labelledby': 'my-label-id' }
   * Note: id, role and onMouseLeave cannot be overridden.
   */
  menuAttributes?: Record<string, ConditionalString>
}

/**
 * Accessible Autocomplete wrapper component.
 * Full interface including form-engine discriminator properties.
 */
export interface AccessibleAutocomplete extends BlockDefinition, AccessibleAutocompleteProps {
  variant: 'accessibleAutocomplete'
}

/**
 * Renders the AccessibleAutocomplete wrapper component.
 *
 * Outputs:
 * 1. A script tag with type="application/json" containing the autocomplete data
 * 2. A wrapper div with data attributes around the field's HTML
 */
export const accessibleAutocomplete = buildNunjucksComponent<AccessibleAutocomplete>(
  'accessibleAutocomplete',
  async (block: EvaluatedBlock<AccessibleAutocomplete>): Promise<string> => {
    const fieldBlock = block.field.block as FieldBlockDefinition & { value?: unknown; defaultValue?: unknown }
    const fieldCode = fieldBlock.code ?? 'autocomplete-field'
    const dataId = `autocomplete-data-${fieldCode}`

    const dataScript = `<script type="application/json" id="${dataId}" data-qa="${dataId}">${JSON.stringify(block.data)}</script>`

    const defaultValue = fieldBlock.value ?? fieldBlock.defaultValue

    const wrapperAttrs = [
      'class="accessible-autocomplete-wrapper"',
      `data-autocomplete-source="${dataId}"`,
      defaultValue !== undefined ? `data-autocomplete-default-value="${defaultValue}"` : '',
      block.dataKeyFrom ? `data-autocomplete-source-key-from="${block.dataKeyFrom}"` : '',
      block.minLength !== undefined ? `data-autocomplete-min-length="${block.minLength}"` : '',
      block.showNoOptionsFound !== undefined ? `data-autocomplete-show-no-options="${block.showNoOptionsFound}"` : '',
      block.menuClasses !== undefined ? `data-autocomplete-menu-classes="${block.menuClasses}"` : '',
      block.inputClasses !== undefined ? `data-autocomplete-input-classes="${block.inputClasses}"` : '',
      block.hintClasses !== undefined ? `data-autocomplete-hint-classes="${block.hintClasses}"` : '',
      block.autoselect !== undefined ? `data-autocomplete-autoselect="${block.autoselect}"` : '',
      block.confirmOnBlur !== undefined ? `data-autocomplete-confirm-on-blur="${block.confirmOnBlur}"` : '',
      block.displayMenu !== undefined ? `data-autocomplete-display-menu="${block.displayMenu}"` : '',
      block.showAllValues !== undefined ? `data-autocomplete-show-all-values="${block.showAllValues}"` : '',
      block.menuAttributes !== undefined
        ? `data-autocomplete-menu-attributes='${JSON.stringify(block.menuAttributes)}'`
        : '',
    ]
      .filter(Boolean)
      .join(' ')

    return `${dataScript}\n<accessible-autocomplete-wrapper ${wrapperAttrs}>\n${block.field.html}\n</accessible-autocomplete-wrapper>`
  },
)

/**
 * Creates an accessible autocomplete wrapper around a field.
 *
 * @example
 * ```typescript
 * AccessibleAutocomplete({
 *   field: GovUKTextInput({ code: 'goal', label: 'Select a goal' }),
 *   data: Data('goals'),
 * })
 * ```
 */
export function AccessibleAutocomplete(props: AccessibleAutocompleteProps): AccessibleAutocomplete {
  return blockBuilder<AccessibleAutocomplete>({ ...props, variant: 'accessibleAutocomplete' })
}
