import { buildComponent } from '@form-engine/registry/utils/buildComponent'
import {
  BlockDefinition,
  ConditionalBoolean,
  ConditionalString,
  EvaluatedBlock,
} from '@form-engine/form/types/structures.type'

/**
 * Button styled as a link component.
 *
 * Renders a `<button>` element styled to look like a GOV.UK link
 * while retaining button functionality for form submissions.
 *
 * Useful for actions like "Remove" or "Clear" that should look like links
 * but need to submit form data.
 *
 * @example
 * ```typescript
 * block<ButtonAsLink>({
 *   variant: 'buttonAsLink',
 *   text: 'Remove',
 *   name: 'action',
 *   value: 'remove_0',
 * })
 * ```
 */
export interface ButtonAsLink extends BlockDefinition {
  variant: 'buttonAsLink'

  /** Text content for the button */
  text: ConditionalString

  /** Name attribute for form submission */
  name?: ConditionalString

  /** Value attribute for form submission */
  value?: ConditionalString

  /** Type attribute - defaults to 'submit' */
  buttonType?: 'button' | 'submit' | 'reset'

  /** Whether the button is disabled */
  disabled?: ConditionalBoolean

  /** Additional CSS classes (appended to button-as-link) */
  classes?: ConditionalString

  /** Button ID */
  id?: ConditionalString

  /** Custom HTML attributes */
  attributes?: Record<string, string>
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const buttonAsLink = buildComponent<ButtonAsLink>(
  'buttonAsLink',
  async (block: EvaluatedBlock<ButtonAsLink>) => {
    const classes = ['button-as-link', block.classes].filter(Boolean).join(' ')
    const type = block.buttonType ?? 'submit'

    const attrs: string[] = [`type="${type}"`, `class="${escapeHtml(classes)}"`]

    if (block.id) {
      attrs.push(`id="${escapeHtml(block.id)}"`)
    }

    if (block.name) {
      attrs.push(`name="${escapeHtml(block.name)}"`)
    }

    if (block.value) {
      attrs.push(`value="${escapeHtml(block.value)}"`)
    }

    if (block.disabled) {
      attrs.push('disabled')
    }

    if (block.attributes) {
      Object.entries(block.attributes).forEach(([key, value]) => {
        attrs.push(`${escapeHtml(key)}="${escapeHtml(value)}"`)
      })
    }

    return `<button ${attrs.join(' ')}>${escapeHtml(block.text)}</button>`
  },
)
