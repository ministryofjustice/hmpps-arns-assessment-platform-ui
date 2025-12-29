import { Data, Format } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { BlockDefinition } from '@form-engine/form/types/structures.type'

/**
 * Creates a styled "Try it" example box for the developer guide.
 *
 * Wraps the provided blocks in a consistent, visually distinct container
 * that signals to users this is an interactive example. Includes a
 * "Continue" button by default.
 *
 * The content is wrapped in a <form> element so that interactive examples
 * work correctly, since the developer guide template doesn't use a form wrapper.
 * CSRF token is included via Data('csrfToken') which is set by the initializeSession effect.
 *
 * Styles are defined in: form-engine-developer-guide/assets/form.scss
 *
 * @param content - Array of blocks/fields to display inside the example box
 * @returns A TemplateWrapper block with the example styling applied
 *
 * @example
 * exampleBox([
 *   GovUKTextInput({
 *     code: 'myField',
 *     label: 'Example field',
 *   }),
 * ])
 */
export const exampleBox = <T extends BlockDefinition>(content: T[]): TemplateWrapper => {
  return TemplateWrapper({
    template: `
      <form method="post" class="app-example-box" novalidate>
        {{slot:csrf}}
        <div class="govuk-!-margin-bottom-6">
          {{slot:content}}
        </div>
        {{slot:button}}
      </form>
    `,
    slots: {
      csrf: [
        HtmlBlock({
          content: Format('<input type="hidden" name="_csrf" value="%1">', Data('csrfToken')),
        }),
      ],
      content,
      button: [
        GovUKButton({
          text: 'Continue',
        }),
      ],
    },
  })
}
