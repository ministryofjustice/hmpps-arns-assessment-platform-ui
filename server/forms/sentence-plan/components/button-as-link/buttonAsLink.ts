import {
  component,
  BlockDefinition,
  ResolvableBoolean,
  ResolvableString,
} from '@ministryofjustice/hmpps-forge/core/components'

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
 * ButtonAsLink({
 *   text: 'Remove',
 *   name: 'action',
 *   value: 'remove_0',
 * })
 * ```
 */
export interface ButtonAsLink extends BlockDefinition {
  /** Text content for the button */
  text: ResolvableString

  /** Name attribute for form submission */
  name?: ResolvableString

  /** Value attribute for form submission */
  value?: ResolvableString

  /** Type attribute - defaults to 'submit' */
  buttonType?: 'button' | 'submit' | 'reset'

  /** Whether the button is disabled */
  disabled?: ResolvableBoolean

  /** Additional CSS classes (appended to button-as-link) */
  classes?: ResolvableString

  /** Button ID */
  id?: ResolvableString

  /** Custom HTML attributes */
  attributes?: Record<string, string>
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export const ButtonAsLink = component<ButtonAsLink>('buttonAsLink', {
  render: props => {
    const classes = ['button-as-link', props.classes].filter(Boolean).join(' ')
    const type = props.buttonType ?? 'submit'

    const attrs: string[] = [`type="${type}"`, `class="${escapeHtml(classes)}"`]

    if (props.id) {
      attrs.push(`id="${escapeHtml(props.id)}"`)
    }

    if (props.name) {
      attrs.push(`name="${escapeHtml(props.name)}"`)
    }

    if (props.value) {
      attrs.push(`value="${escapeHtml(props.value)}"`)
    }

    if (props.disabled) {
      attrs.push('disabled')
    }

    if (props.attributes) {
      Object.entries(props.attributes).forEach(([key, value]) => {
        attrs.push(`${escapeHtml(key)}="${escapeHtml(String(value))}"`)
      })
    }

    return `<button ${attrs.join(' ')}>${escapeHtml(props.text)}</button>`
  },
})
