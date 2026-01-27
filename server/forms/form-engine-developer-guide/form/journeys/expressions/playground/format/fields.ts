import { Answer, Format, Self, validation, when } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import {
  GovUKDetails,
  GovUKPagination,
  GovUKRadioInput,
  GovUKTextInput,
} from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'
import { exampleBox } from '../../../../../helpers/exampleBox'

/**
 * Expressions Playground - Format
 *
 * Interactive examples of Format() string interpolation.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Format Expressions Playground

  Try these interactive examples to see \`Format()\` string
  interpolation in action. Type in the fields to see dynamic content update. {.lead}

  ---

  ## Basic String Interpolation

  Type your name and watch the greeting message update dynamically.

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## Multiple Placeholders

  Use \`%1\`, \`%2\`, \`%3\` to insert multiple values.
  Fill in both fields to see the combined result.

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## Dynamic Field Labels

  \`Format()\` can be used in field properties like \`label\` and
  \`hint\`. Enter a contact name to see the phone field label update.

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## Combining with Transformers

  Use \`.pipe()\` to transform values before formatting.
  Try entering a price to see it formatted as currency.

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## Building a Summary Card

  \`Format()\` is perfect for building summary displays from form data.
  Fill in the details to see the summary update.

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_format_name',
          label: 'Your name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your name to see the example',
            }),
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_format_name').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Result:</strong> Hello, %1! Welcome to the playground.
            </div>`,
            Answer('playground_format_name'),
          ),
        }),
      ]),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
                code: 'playground_format_name',
                label: 'Your name',
              })

              HtmlBlock({
                hidden: Answer('playground_format_name').not.match(Condition.IsRequired()),
                content: Format(
                  'Hello, %1! Welcome to the playground.',
                  Answer('playground_format_name')
                ),
              })
            `,
          }),
        ],
      }),
    ],
    example2: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_format_firstname',
          label: 'First name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your first name',
            }),
          ],
        }),

        GovUKTextInput({
          code: 'playground_format_lastname',
          label: 'Last name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your last name',
            }),
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_format_firstname').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Full name:</strong> %1 %2
            </div>`,
            Answer('playground_format_firstname'),
            Answer('playground_format_lastname'),
          ),
        }),
      ]),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Format(
                '%1 %2',
                Answer('playground_format_firstname'),
                Answer('playground_format_lastname')
              )
              // → "John Smith"
            `,
          }),
        ],
      }),
    ],
    example3: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_format_contact',
          label: 'Contact name',
          hint: 'Who should we contact?',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a contact name',
            }),
          ],
        }),

        GovUKTextInput({
          code: 'playground_format_phone',
          label: when(Answer('playground_format_contact').match(Condition.IsRequired()))
            .then(Format('Phone number for %1', Answer('playground_format_contact')))
            .else('Phone number'),
          hint: when(Answer('playground_format_contact').match(Condition.IsRequired()))
            .then(Format('We will call %1 on this number if needed', Answer('playground_format_contact')))
            .else('Enter a contact name above to see dynamic hint'),
          hidden: Answer('playground_format_contact').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
                code: 'playground_format_phone',
                label: Format('Phone number for %1', Answer('playground_format_contact')),
                hint: Format('We will call %1 on this number', Answer('playground_format_contact')),
              })
            `,
          }),
        ],
      }),
    ],
    example4: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_format_price',
          label: 'Price',
          hint: 'Enter a number (e.g., 19.99)',
          prefix: { text: '£' },
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a price',
            }),
            validation({
              when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsNumber()),
              message: 'Enter a valid number',
            }),
          ],
        }),

        GovUKRadioInput({
          code: 'playground_format_quantity',
          fieldset: {
            legend: { text: 'Quantity' },
          },
          items: [
            { value: '1', text: '1' },
            { value: '2', text: '2' },
            { value: '5', text: '5' },
          ],
          hidden: Answer('playground_format_price').not.match(Condition.IsRequired()),
        }),

        HtmlBlock({
          hidden: Answer('playground_format_quantity').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Order summary:</strong><br>
              %1 item(s) at £%2 each
            </div>`,
            Answer('playground_format_quantity'),
            Answer('playground_format_price'),
          ),
        }),
      ]),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Transform price to 2 decimal places
              Format(
                'Order: %1 × £%2',
                Answer('quantity'),
                Answer('price').pipe(
                  Transformer.String.ToFloat(),
                  Transformer.Number.ToFixed(2)
                )
              )
            `,
          }),
        ],
      }),
    ],
    example5: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_format_business',
          label: 'Business name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a business name',
            }),
          ],
        }),

        GovUKTextInput({
          code: 'playground_format_email',
          label: 'Email address',
          inputType: 'email',
          hidden: Answer('playground_format_business').not.match(Condition.IsRequired()),
        }),

        GovUKTextInput({
          code: 'playground_format_postcode',
          label: 'Postcode',
          classes: 'govuk-input--width-10',
          hidden: Answer('playground_format_business').not.match(Condition.IsRequired()),
        }),

        HtmlBlock({
          hidden: Answer('playground_format_business').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-!-margin-top-4">
              <h3 class="govuk-heading-s">Your Summary</h3>
              <dl class="govuk-summary-list govuk-!-margin-bottom-0">
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Business</dt>
                  <dd class="govuk-summary-list__value">%1</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Email</dt>
                  <dd class="govuk-summary-list__value">%2</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Postcode</dt>
                  <dd class="govuk-summary-list__value">%3</dd>
                </div>
              </dl>
            </div>`,
            Answer('playground_format_business'),
            when(Answer('playground_format_email').match(Condition.IsRequired()))
              .then(Answer('playground_format_email'))
              .else('<em>Not provided</em>'),
            when(Answer('playground_format_postcode').match(Condition.IsRequired()))
              .then(Answer('playground_format_postcode'))
              .else('<em>Not provided</em>'),
          ),
        }),
      ]),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              HtmlBlock({
                content: Format(
                  \`<dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                      <dt>Business</dt>
                      <dd>%1</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt>Email</dt>
                      <dd>%2</dd>
                    </div>
                  </dl>\`,
                  Answer('business'),
                  when(Answer('email').match(Condition.IsRequired()))
                    .then(Answer('email'))
                    .else('<em>Not provided</em>')
                ),
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/expressions/playground/intro',
          labelText: 'Playground Hub',
        },
        next: {
          href: '/form-engine-developer-guide/expressions/playground/conditional',
          labelText: 'Conditional Playground',
        },
      }),
    ],
  },
})
