import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components/code-block/codeBlock'

/**
 * Recipe: Conditional Field Visibility
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Recipe: Conditional Visibility

Show or hide a field based on another field's value. {.lead}

---

## The Pattern

Use the \`hidden\` property with \`.not.match()\` to hide a field when a
condition is NOT met (i.e., show it when the condition IS met).

{{slot:basicExample}}

---

## How It Works

1. \`Answer('contactMethod')\` references the value of the radio field
2. \`.not.match(Condition.Equals('phone'))\` returns true when the value is NOT 'phone'
3. When true, the field is hidden; when false (value IS 'phone'), the field is shown
4. \`dependent\` clears the field value when the dependency is not met

---

## Key Properties

| Property | Purpose |
|----------|---------|
| \`hidden\` | Boolean expression that hides the field when true |
| \`dependent\` | Clears field value and skips validation when false |

Use both together for "reveal" fields like "Other - please specify".

---

## Common Variations

### Inline reveal with radio items

Use the \`block\` property on a radio item to reveal a field inline when that
option is selected. This is the GOV.UK "conditional reveal" pattern.

{{slot:inlineRevealExample}}

### Show when field has any value

{{slot:notEmptyExample}}

### Show when one of multiple values

{{slot:oneOfExample}}

### Show based on multiple conditions

{{slot:multipleExample}}

---

## Related Concepts

- [Conditions](/forms/form-engine-developer-guide/conditions/intro) - All available condition types
- [References](/forms/form-engine-developer-guide/references/intro) - How Answer() and other references work
- [Chaining](/forms/form-engine-developer-guide/references/chaining) - The fluent .match() API

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { field, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKRadioInput, GovUKTextInput } from '@form-engine-govuk-components/components'

          export const contactMethod = field<GovUKRadioInput>({
            variant: 'govukRadioInput',
            code: 'contactMethod',
            fieldset: {
              legend: { text: 'How should we contact you?' },
            },
            items: [
              { value: 'email', text: 'Email' },
              { value: 'phone', text: 'Phone' },
              { value: 'post', text: 'Post' },
            ],
          })

          export const phoneNumber = field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'phoneNumber',
            label: 'Phone number',
            // Hide when contactMethod is NOT 'phone'
            hidden: Answer('contactMethod').not.match(Condition.Equals('phone')),
            // Clear value when contactMethod is not 'phone'
            dependent: Answer('contactMethod').match(Condition.Equals('phone')),
          })
        `,
      }),
    ],
    inlineRevealExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { field, validation, Self, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKRadioInput, GovUKTextInput } from '@form-engine-govuk-components/components'

          export const hasPhone = field<GovUKRadioInput>({
            variant: 'govukRadioInput',
            code: 'hasPhone',
            fieldset: {
              legend: { text: 'Can we contact you by phone?' },
            },
            items: [
              {
                value: 'yes',
                text: 'Yes',
                // Nested field revealed when this option is selected
                block: field<GovUKTextInput>({
                  variant: 'govukTextInput',
                  code: 'phoneNumber',
                  label: 'Phone number',
                  inputType: 'tel',
                  // Only validate when parent option is selected
                  dependent: Answer('hasPhone').match(Condition.Equals('yes')),
                  validate: [
                    validation({
                      when: Self().not.match(Condition.IsRequired()),
                      message: 'Enter your phone number',
                    }),
                  ],
                }),
              },
              { value: 'no', text: 'No' },
            ],
          })
        `,
      }),
    ],
    notEmptyExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Show when a field has any value (hide when empty)
          hidden: Answer('firstName').not.match(Condition.IsRequired())
        `,
      }),
    ],
    oneOfExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Show when value is one of several options
          hidden: Answer('country').not.match(
            Condition.Array.IsIn(['UK', 'US', 'CA', 'AU'])
          )
        `,
      }),
    ],
    multipleExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { and } from '@form-engine/form/builders'

          // Show when multiple conditions are met
          hidden: not(
            and(
              Answer('hasEmail').match(Condition.Equals('yes')),
              Answer('preferredContact').match(Condition.Equals('email'))
            )
          )
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/intro',
          labelText: 'Recipes Overview',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/custom-validation',
          labelText: 'Custom Validation',
        },
      }),
    ],
  },
})
