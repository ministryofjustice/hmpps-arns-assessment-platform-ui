import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, EvaluatedBlock, FieldBlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'

/**
 * Props for the WrappingSelect component.
 *
 * Wraps a GovUKSelectInput with a custom ARIA combobox so long option labels can
 * wrap onto multiple lines in both the closed and open states. The native <select>
 * remains the source of truth for the form value (and is the no-JS fallback).
 *
 * The client-side enhancement reads options from the underlying <select>, builds
 * a button + listbox combobox, and writes back to the select on selection so the
 * form submits unchanged.
 */
export interface WrappingSelectProps {
  /**
   * The select field to enhance. Must be a GovUKSelectInput. The rendered
   * <select> stays in the DOM (visually hidden when JS enhances) and is what
   * the form submits.
   */
  field: FieldBlockDefinition
}

export interface WrappingSelect extends BlockDefinition, WrappingSelectProps {
  variant: 'wrappingSelect'
}

export const wrappingSelect = buildNunjucksComponent<WrappingSelect>(
  'wrappingSelect',
  (block: EvaluatedBlock<WrappingSelect>): string => {
    return `<wrapping-select-wrapper class="wrapping-select">\n${block.field.html}\n</wrapping-select-wrapper>`
  },
)

/**
 * Wraps a GovUKSelectInput with an accessible combobox where long option labels
 * wrap onto multiple lines. Use for coded selects with long display labels.
 *
 * @example
 * ```typescript
 * WrappingSelect({
 *   field: GovUKSelectInput({ code: 'actor', items: actorLabelOptions, ... }),
 * })
 * ```
 */
export function WrappingSelect(props: WrappingSelectProps): WrappingSelect {
  return blockBuilder<WrappingSelect>({ ...props, variant: 'wrappingSelect' })
}
