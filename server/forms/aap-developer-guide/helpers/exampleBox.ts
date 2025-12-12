import { block, Data, Format } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
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
 * Styles are defined in: server/forms/aap-developer-guide/form.scss
 *
 * @param content - Array of blocks/fields to display inside the example box
 * @returns A TemplateWrapper block with the example styling applied
 *
 * @example
 * exampleBox([
 *   field<GovUKTextInput>({
 *     variant: 'govukTextInput',
 *     code: 'myField',
 *     label: 'Example field',
 *   }),
 * ])
 */
export const exampleBox = <T extends BlockDefinition>(content: T[]): TemplateWrapper => {
  return block<TemplateWrapper>({
    variant: 'templateWrapper',
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
        block<HtmlBlock>({
          variant: 'html',
          content: Format('<input type="hidden" name="_csrf" value="%1">', Data('csrfToken')),
        }),
      ],
      content,
      button: [
        block<GovUKButton>({
          variant: 'govukButton',
          text: 'Continue',
        }),
      ],
    },
  })
}
