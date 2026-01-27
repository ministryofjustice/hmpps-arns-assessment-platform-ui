import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Answer()
 *
 * Comprehensive documentation for the Answer() reference,
 * including usage patterns, nested properties, and common scenarios.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Answer()

The \`Answer()\` reference retrieves values from field responses.
It's the most commonly used reference type for building dynamic forms. {.lead}

---

## Signature

{{slot:signatureCode}}

**Parameters:**

- \`target\` — The field code as a string, or a field definition object

---

## Basic Usage

Reference a field by its code:

{{slot:basicCode}}

### Using with Field Definitions

You can also pass a field definition directly. The form-engine extracts
the \`code\` property automatically:

{{slot:fieldDefCode}}

---

## Nested Properties

Use dot notation to access nested values within an answer:

{{slot:nestedCode}}

---

## Common Scenarios

### 1. Conditional Visibility

Show or hide fields based on another field's value:

{{slot:scenario1Code}}

### 2. Dynamic Content

Display personalised content using the user's input:

{{slot:scenario2Code}}

### 3. Pre-populating Fields

Copy values from one field to another:

{{slot:scenario3Code}}

### 4. Cross-Field Validation

Validate one field based on another's value:

{{slot:scenario4Code}}

---

## Local vs Remote Answers

Answers can come from two sources:

### Local Answers (Same Step)

When referencing a field on the same step, the answer is resolved from:

1. POST data (if the form was just submitted)
2. Format pipeline output (after transformers)
3. Default value (if no user input)
4. onAccess effects (data set during page access)

### Remote Answers (Different Step)

When referencing a field from another step, the answer must be made available
through onAccess transitions that pre-populate the answer store.

{{slot:technicalDetails}}

---

## Best Practices

- **Use consistent field codes:** Stick to snake_case for all field codes to avoid confusion
- **Pass field definitions when available:** Using \`Answer(myField)\` instead of \`Answer('my_field')\` helps catch typos at compile time
- **Handle missing values:** If a referenced field might not have a value, use Conditional() with a fallback or check with \`Condition.IsPresent()\`
- **Consider validation order:** When cross-referencing fields, ensure the source field validates first (validation runs top-to-bottom)

---

{{slot:pagination}}
`),
  slots: {
    signatureCode: [
      CodeBlock({
        language: 'typescript',
        code: `Answer(target: string | FieldDefinition): ReferenceExpr`,
      }),
    ],
    basicCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Answer } from '@form-engine/form/builders'

          // Reference by string code
          Answer('email')
          Answer('firstName')
          Answer('dateOfBirth')
        `,
      }),
    ],
    fieldDefCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          const emailField = GovUKTextInput({
            code: 'email',
            label: 'Email address',
          })

          // These are equivalent:
          Answer('email')
          Answer(emailField)
        `,
      }),
    ],
    nestedCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // If a field stores an object (e.g., from a composite field)
          Answer('address.street')
          Answer('address.city')
          Answer('address.postcode')

          // Works with arrays too
          Answer('contacts.0.email')  // First contact's email
          Answer('items.1.quantity')  // Second item's quantity
        `,
      }),
    ],
    scenario1Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Show "other" text input only when "other" is selected
          GovUKTextInput({
            code: 'contactMethodOther',
            label: 'Please specify',
            hidden: Answer('contactMethod').not.match(Condition.Equals('other')),
            dependent: Answer('contactMethod').match(Condition.Equals('other')),
          })
        `,
      }),
    ],
    scenario2Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          HtmlBlock({
            content: Format('Thank you, %1. We will contact you at %2.',
              Answer('fullName'),
              Answer('email')
            ),
          })
        `,
      }),
    ],
    scenario3Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Use billing address as default shipping address
          GovUKTextInput({
            code: 'shippingStreet',
            label: 'Street address',
            defaultValue: Answer('billingStreet'),
          })
        `,
      }),
    ],
    scenario4Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          // End date must be after start date
          GovUKDateInputFull({
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
          })
        `,
      }),
    ],
    technicalDetails: [
      GovUKDetails({
        summaryText: 'Technical detail: Answer resolution priority',
        content: [
          HtmlBlock({
            content: `
              <p class="govuk-body">
                The form-engine resolves local answers in this priority order:
              </p>
              <ol class="govuk-list govuk-list--number">
                <li><strong>Formatted POST value</strong> — User's input after format pipeline</li>
                <li><strong>Raw POST value</strong> — User's input before formatting</li>
                <li><strong>Default value</strong> — Static or computed default</li>
                <li><strong>OnLoad value</strong> — Set by effects during page load</li>
              </ol>
              <p class="govuk-body">
                This ensures the most recent user input always takes precedence.
              </p>
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/references/intro',
          labelText: 'Understanding References',
        },
        next: {
          href: '/form-engine-developer-guide/references/data',
          labelText: 'Data Reference',
        },
      }),
    ],
  },
})
