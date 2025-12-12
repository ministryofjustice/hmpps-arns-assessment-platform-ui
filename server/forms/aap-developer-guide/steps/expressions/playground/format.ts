import {
  step,
  block,
  field,
  validation,
  Self,
  Answer,
  Format,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import {
  GovUKTextInput,
  GovUKDetails,
  GovUKPagination,
  GovUKRadioInput,
} from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Expressions Playground - Format
 *
 * Interactive examples of Format() string interpolation.
 */
export const formatStep = step({
  path: '/format',
  title: 'Format Playground',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Format Expressions Playground</h1>

        <p class="govuk-body-l">
          Try these interactive examples to see <code>Format()</code> string
          interpolation in action. Type in the fields to see dynamic content update.
        </p>
      `,
    }),

    // Basic Interpolation
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic String Interpolation</h2>
        <p class="govuk-body">
          Type your name and watch the greeting message update dynamically.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_name',
        label: 'Your name',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your name to see the example',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        hidden: Answer('playground_format_name').not.match(Condition.IsRequired()),
        content: Format(
          `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            <strong>Result:</strong> Hello, %1! Welcome to the playground.
          </div>`,
          Answer('playground_format_name'),
        ),
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_format_name',
  label: 'Your name',
})

block<HtmlBlock>({
  variant: 'html',
  hidden: Answer('playground_format_name').not.match(Condition.IsRequired()),
  content: Format(
    'Hello, %1! Welcome to the playground.',
    Answer('playground_format_name')
  ),
})`,
        }),
      ],
    }),

    // Multiple Placeholders
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Multiple Placeholders</h2>
        <p class="govuk-body">
          Use <code>%1</code>, <code>%2</code>, <code>%3</code> to insert multiple values.
          Fill in both fields to see the combined result.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_firstname',
        label: 'First name',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your first name',
          }),
        ],
      }),

      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_lastname',
        label: 'Last name',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your last name',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `Format(
  '%1 %2',
  Answer('playground_format_firstname'),
  Answer('playground_format_lastname')
)
// → "John Smith"`,
        }),
      ],
    }),

    // Dynamic Labels
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Field Labels</h2>
        <p class="govuk-body">
          <code>Format()</code> can be used in field properties like <code>label</code> and
          <code>hint</code>. Enter a contact name to see the phone field label update.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
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

      field<GovUKTextInput>({
        variant: 'govukTextInput',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_format_phone',
  label: Format('Phone number for %1', Answer('playground_format_contact')),
  hint: Format('We will call %1 on this number', Answer('playground_format_contact')),
})`,
        }),
      ],
    }),

    // With Transformers
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Combining with Transformers</h2>
        <p class="govuk-body">
          Use <code>.pipe()</code> to transform values before formatting.
          Try entering a price to see it formatted as currency.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
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
            when: Self()
              .pipe(Transformer.String.ToFloat())
              .not.match(Condition.Number.IsNumber()),
            message: 'Enter a valid number',
          }),
        ],
      }),

      field<GovUKRadioInput>({
        variant: 'govukRadioInput',
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

      block<HtmlBlock>({
        variant: 'html',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// Transform price to 2 decimal places
Format(
  'Order: %1 × £%2',
  Answer('quantity'),
  Answer('price').pipe(
    Transformer.String.ToFloat(),
    Transformer.Number.ToFixed(2)
  )
)`,
        }),
      ],
    }),

    // Summary Card
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Building a Summary Card</h2>
        <p class="govuk-body">
          <code>Format()</code> is perfect for building summary displays from form data.
          Fill in the details to see the summary update.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_business',
        label: 'Business name',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a business name',
          }),
        ],
      }),

      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_email',
        label: 'Email address',
        inputType: 'email',
        hidden: Answer('playground_format_business').not.match(Condition.IsRequired()),
      }),

      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_format_postcode',
        label: 'Postcode',
        classes: 'govuk-input--width-10',
        hidden: Answer('playground_format_business').not.match(Condition.IsRequired()),
      }),

      block<HtmlBlock>({
        variant: 'html',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `block<HtmlBlock>({
  variant: 'html',
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
})`,
        }),
      ],
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/expressions/playground/intro',
              labelText: 'Playground Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/playground/conditional',
              labelText: 'Conditional Playground',
            },
          }),
        ],
      },
    }),
  ],
})
