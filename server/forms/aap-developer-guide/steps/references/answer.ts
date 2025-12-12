import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * References - Answer()
 *
 * Comprehensive documentation for the Answer() reference,
 * including usage patterns, nested properties, and common scenarios.
 */
export const answerStep = step({
  path: '/answer',
  title: 'Answer Reference',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Answer()</h1>

        <p class="govuk-body-l">
          The <code>Answer()</code> reference retrieves values from field responses.
          It's the most commonly used reference type for building dynamic forms.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Signature</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Answer(target: string | FieldDefinition): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <strong>Parameters:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><code>target</code> &mdash; The field code as a string, or a field definition object</li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Basic Usage</h2>
        <p class="govuk-body">Reference a field by its code:</p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Answer } from '@form-engine/form/builders'

// Reference by string code
Answer('email')
Answer('firstName')
Answer('dateOfBirth')`,
    }),

    // Using with field definitions
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Using with Field Definitions</h3>
        <p class="govuk-body">
          You can also pass a field definition directly. The form-engine extracts
          the <code>code</code> property automatically:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
const emailField = field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email address',
})

// These are equivalent:
Answer('email')
Answer(emailField)`,
          }),
        ],
      },
    }),

    // Nested properties
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Nested Properties</h2>
        <p class="govuk-body">
          Use dot notation to access nested values within an answer:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// If a field stores an object (e.g., from a composite field)
Answer('address.street')
Answer('address.city')
Answer('address.postcode')

// Works with arrays too
Answer('contacts.0.email')  // First contact's email
Answer('items.1.quantity')  // Second item's quantity`,
    }),

    // Common scenarios
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Scenarios</h2>
      `,
    }),

    // Scenario 1: Conditional visibility
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">1. Conditional Visibility</h3>
        <p class="govuk-body">
          Show or hide fields based on another field's value:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Show "other" text input only when "other" is selected
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'contactMethodOther',
  label: 'Please specify',
  hidden: Answer('contactMethod').not.match(Condition.Equals('other')),
  dependent: Answer('contactMethod').match(Condition.Equals('other')),
})`,
          }),
        ],
      },
    }),

    // Scenario 2: Dynamic content
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">2. Dynamic Content</h3>
        <p class="govuk-body">
          Display personalised content using the user's input:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<HtmlBlock>({
  variant: 'html',
  content: Format('Thank you, %1. We will contact you at %2.',
    Answer('fullName'),
    Answer('email')
  ),
})`,
          }),
        ],
      },
    }),

    // Scenario 3: Default values
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">3. Pre-populating Fields</h3>
        <p class="govuk-body">
          Copy values from one field to another:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Use billing address as default shipping address
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'shippingStreet',
  label: 'Street address',
  defaultValue: Answer('billingStreet'),
})`,
          }),
        ],
      },
    }),

    // Scenario 4: Cross-field validation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">4. Cross-Field Validation</h3>
        <p class="govuk-body">
          Validate one field based on another's value:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// End date must be after start date
field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'endDate',
  fieldset: { legend: { text: 'End date' } },
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an end date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a valid end date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsAfter(Answer('startDate'))),
      message: 'End date must be after the start date',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Local vs Remote answers
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Local vs Remote Answers</h2>

        <p class="govuk-body">
          Answers can come from two sources:
        </p>

        <h3 class="govuk-heading-s">Local Answers (Same Step)</h3>
        <p class="govuk-body">
          When referencing a field on the same step, the answer is resolved from:
        </p>
        <ol class="govuk-list govuk-list--number">
          <li>POST data (if the form was just submitted)</li>
          <li>Format pipeline output (after transformers)</li>
          <li>Default value (if no user input)</li>
          <li>OnLoad effects (data set during page load)</li>
        </ol>

        <h3 class="govuk-heading-s">Remote Answers (Different Step)</h3>
        <p class="govuk-body">
          When referencing a field from another step, the answer must be made available
          through onLoad transitions that pre-populate the answer store.
        </p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Technical detail: Answer resolution priority',
      content: [
        block<HtmlBlock>({
          variant: 'html',
          content: `
            <p class="govuk-body">
              The form-engine resolves local answers in this priority order:
            </p>
            <ol class="govuk-list govuk-list--number">
              <li><strong>Formatted POST value</strong> &mdash; User's input after format pipeline</li>
              <li><strong>Raw POST value</strong> &mdash; User's input before formatting</li>
              <li><strong>Default value</strong> &mdash; Static or computed default</li>
              <li><strong>OnLoad value</strong> &mdash; Set by effects during page load</li>
            </ol>
            <p class="govuk-body">
              This ensures the most recent user input always takes precedence.
            </p>
          `,
        }),
      ],
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Use consistent field codes:</strong> Stick to snake_case for all field codes
            to avoid confusion
          </li>
          <li>
            <strong>Pass field definitions when available:</strong> Using <code>Answer(myField)</code>
            instead of <code>Answer('my_field')</code> helps catch typos at compile time
          </li>
          <li>
            <strong>Handle missing values:</strong> If a referenced field might not have a value,
            use Conditional() with a fallback or check with <code>Condition.IsPresent()</code>
          </li>
          <li>
            <strong>Consider validation order:</strong> When cross-referencing fields, ensure
            the source field validates first (validation runs top-to-bottom)
          </li>
        </ul>
      `,
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
              href: '/forms/form-engine-developer-guide/references/intro',
              labelText: 'Understanding References',
            },
            next: {
              href: '/forms/form-engine-developer-guide/references/data',
              labelText: 'Data Reference',
            },
          }),
        ],
      },
    }),
  ],
})
