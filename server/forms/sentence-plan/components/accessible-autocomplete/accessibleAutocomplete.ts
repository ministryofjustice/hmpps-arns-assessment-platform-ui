import {
  BlockDefinition,
  ResolvableArray,
  ResolvableBoolean,
  ResolvableNumber,
  ResolvableString,
  FieldBlockDefinition,
} from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'

/**
 * Accessible Autocomplete wrapper component.
 *
 * @see https://github.com/alphagov/accessible-autocomplete
 * @example
 * ```typescript
 * AccessibleAutocomplete({
 *   field: GovUKTextInput({ code: 'goal', label: 'Select a goal' }),
 *   data: Data('goals'),
 * })
 * ```
 */
export interface AccessibleAutocomplete extends BlockDefinition {
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
  data: ResolvableArray<string> | Record<string, ResolvableArray<string>>

  /**
   * CSS selector for an element whose value determines the data key.
   * Only used when `data` is a keyed object.
   *
   * @example '#area-of-need-input' - Gets value from element with this ID
   */
  dataKeyFrom?: ResolvableString

  /**
   * Minimum number of characters before showing suggestions.
   * @default 2
   */
  minLength?: ResolvableNumber

  /**
   * Whether to show a "no results found" message when no options match.
   * @default false
   */
  showNoOptionsFound?: ResolvableBoolean

  /**
   * Highlight the first option when the user types and receives results.
   * Pressing enter will select it.
   * @default false
   */
  autoselect?: ResolvableBoolean

  /**
   * Confirm the selected option when the user clicks outside the component.
   * @default true
   */
  confirmOnBlur?: ResolvableBoolean

  /**
   * How the menu should appear - inline or as an overlay.
   * @default 'inline'
   */
  displayMenu?: ResolvableString

  /**
   * Show all values when the user clicks the input (like a dropdown).
   * Renders with a dropdown arrow to convey this behaviour.
   * @default false
   */
  showAllValues?: ResolvableBoolean

  /**
   * HTML attributes to set on the menu element.
   * Useful for accessibility, e.g. { 'aria-labelledby': 'my-label-id' }
   * Note: id, role and onMouseLeave cannot be overridden.
   */
  menuAttributes?: Record<string, ResolvableString>

  /**
   * CSS classes for the wrapper element. Apply width classes here (e.g.
   * 'govuk-!-width-two-thirds') so the input and dropdown menu stay aligned —
   * a width on the input alone leaves the menu overhanging at full width.
   */
  classes?: ResolvableString
}

/**
 * Renders the AccessibleAutocomplete wrapper component.
 *
 * Outputs:
 * 1. A script tag with type="application/json" containing the autocomplete data
 * 2. A wrapper div with data attributes around the field's HTML
 */
export const AccessibleAutocomplete = nunjucksComponent<AccessibleAutocomplete>('accessibleAutocomplete', {
  render: props => {
    const fieldBlock = props.field.block as FieldBlockDefinition & { value?: unknown; defaultValue?: unknown }
    const fieldCode = fieldBlock.code ?? 'autocomplete-field'
    const dataId = `autocomplete-data-${fieldCode}`

    const dataScript = `<script type="application/json" id="${dataId}" data-qa="${dataId}">${JSON.stringify(props.data)}</script>`

    const defaultValue = fieldBlock.value ?? fieldBlock.defaultValue

    // Width must sit on the wrapper, not the input: a width class on the input alone
    // leaves the dropdown menu (sized off the wrapper) at full width and overhanging.
    const wrapperClasses = ['accessible-autocomplete-wrapper', props.classes].filter(Boolean).join(' ')

    const wrapperAttrs = [
      `class="${wrapperClasses}"`,
      `data-autocomplete-source="${dataId}"`,
      defaultValue !== undefined ? `data-autocomplete-default-value="${defaultValue}"` : '',
      props.dataKeyFrom ? `data-autocomplete-source-key-from="${props.dataKeyFrom}"` : '',
      props.minLength !== undefined ? `data-autocomplete-min-length="${props.minLength}"` : '',
      props.showNoOptionsFound !== undefined ? `data-autocomplete-show-no-options="${props.showNoOptionsFound}"` : '',
      props.autoselect !== undefined ? `data-autocomplete-autoselect="${props.autoselect}"` : '',
      props.confirmOnBlur !== undefined ? `data-autocomplete-confirm-on-blur="${props.confirmOnBlur}"` : '',
      props.displayMenu !== undefined ? `data-autocomplete-display-menu="${props.displayMenu}"` : '',
      props.showAllValues !== undefined ? `data-autocomplete-show-all-values="${props.showAllValues}"` : '',
      props.menuAttributes !== undefined
        ? `data-autocomplete-menu-attributes='${JSON.stringify(props.menuAttributes)}'`
        : '',
    ]
      .filter(Boolean)
      .join(' ')

    return `${dataScript}\n<accessible-autocomplete-wrapper ${wrapperAttrs}>\n${props.field.html}\n</accessible-autocomplete-wrapper>`
  },
})
