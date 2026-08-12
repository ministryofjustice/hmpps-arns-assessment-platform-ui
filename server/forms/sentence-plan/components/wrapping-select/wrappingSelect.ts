import { BlockDefinition, FieldBlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'

/**
 * Wraps a GovUKSelectInput with a custom ARIA combobox so long option labels can
 * wrap onto multiple lines in both the closed and open states. The native <select>
 * remains the source of truth for the form value (and is the no-JS fallback).
 *
 * The client-side enhancement reads options from the underlying <select>, builds
 * a button + listbox combobox, and writes back to the select on selection so the
 * form submits unchanged.
 *
 * @example
 * ```typescript
 * WrappingSelect({
 *   field: GovUKSelectInput({ code: 'actor', items: actorLabelOptions, ... }),
 * })
 * ```
 */
export interface WrappingSelect extends BlockDefinition {
  /**
   * The select field to wrap. Must be a GovUKSelectInput. The original dropdown
   * stays on the page (hidden when JavaScript is available) so the form still
   * submits the selected value in the normal way.
   */
  field: FieldBlockDefinition
}

export const WrappingSelect = nunjucksComponent<WrappingSelect>('wrappingSelect', {
  render: props => {
    return `<wrapping-select-wrapper class="wrapping-select">\n${props.field.html}\n</wrapping-select-wrapper>`
  },
})
