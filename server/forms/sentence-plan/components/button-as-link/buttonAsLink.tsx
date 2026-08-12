import { BlockDefinition, ResolvableBoolean, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { jsxComponent } from '@ministryofjustice/hmpps-forge/jsx-components'

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

export const ButtonAsLink = jsxComponent<ButtonAsLink>('buttonAsLink', {
  render: props => {
    const classes = ['button-as-link', props.classes].filter(Boolean).join(' ')

    // Evaluation widens the literal prop types, so pin the type back to the union
    const buttonType = (props.buttonType as ButtonAsLink['buttonType']) ?? 'submit'

    return <button
        type={buttonType}
        class={classes}
        id={props.id}
        name={props.name}
        value={props.value}
        disabled={Boolean(props.disabled)}
        {...props.attributes}
      >
        {props.text}
      </button>
  },
})
