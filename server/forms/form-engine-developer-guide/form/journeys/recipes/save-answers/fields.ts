import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Save Answers on Submit
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Save Answers on Submit

Save form answers to an API or session when a step is submitted. {.lead}

---

## The Pattern

Use \`submitTransition\` with \`validate: true\` and an effect in \`onValid\`:

{{slot:basicExample}}

---

## How It Works

1. \`validate: true\` shows validation errors and enables \`onValid\`/\`onInvalid\` paths
2. \`onValid.effects\` runs only when all validations pass
3. \`onValid.next\` navigates after effects complete
4. Omit \`onInvalid\` to stay on the page with errors shown

---

## Key Properties

| Property | Purpose |
|----------|---------|
| \`validate: true\` | Show errors, enable onValid/onInvalid |
| \`validate: false\` | Hide errors, use onAlways only (for drafts) |
| \`onValid\` | Runs when validation passes |
| \`onInvalid\` | Runs when validation fails (optional) |
| \`onAlways\` | Runs regardless of validation |

---

## Common Variations

### Save draft without validation

{{slot:draftExample}}

### Multiple submit buttons

{{slot:multiButtonExample}}

### Save on invalid (with draft)

{{slot:saveOnInvalidExample}}

---

## Related Concepts

- [Transitions](/forms/form-engine-developer-guide/transitions/submit) - Full submit transition documentation
- [Effects](/forms/form-engine-developer-guide/effects/intro) - Creating effects
- [Load Data](/forms/form-engine-developer-guide/recipes/load-data) - Loading data on entry

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { step, submitTransition, next } from '@form-engine/form/builders'
          import { MyFormEffects } from '../effects'

          export const personalDetailsStep = step({
            path: '/personal-details',
            title: 'Personal Details',
            blocks: [/* form fields */],

            onSubmission: [
              submitTransition({
                validate: true,
                onValid: {
                  effects: [MyFormEffects.saveAnswers()],
                  next: [next({ goto: '/contact-details' })],
                },
                // onInvalid omitted - stays on page with errors
              }),
            ],
          })
        `,
      }),
    ],
    draftExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Post } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'

          onSubmission: [
            // Save draft button - no validation
            submitTransition({
              when: Post('action').match(Condition.Equals('saveDraft')),
              validate: false,
              onAlways: {
                effects: [MyFormEffects.saveDraft()],
                next: [next({ goto: '/dashboard' })],
              },
            }),

            // Continue button - with validation
            submitTransition({
              validate: true,
              onValid: {
                effects: [MyFormEffects.saveAnswers()],
                next: [next({ goto: '/next-step' })],
              },
            }),
          ]
        `,
      }),
    ],
    multiButtonExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // In fields.ts - buttons with name/value
          GovUKButton({
            text: 'Save and add another',
            name: 'action',
            value: 'saveAndAdd',
            classes: 'govuk-button--secondary',
          }),
          GovUKButton({
            text: 'Save and finish',
            name: 'action',
            value: 'save',
          }),

          // In step.ts - handle each button
          onSubmission: [
            submitTransition({
              when: Post('action').match(Condition.Equals('saveAndAdd')),
              validate: true,
              onValid: {
                effects: [MyFormEffects.saveItem()],
                next: [next({ goto: '/items/new' })],
              },
            }),
            submitTransition({
              when: Post('action').match(Condition.Equals('save')),
              validate: true,
              onValid: {
                effects: [MyFormEffects.saveItem()],
                next: [next({ goto: '/items' })],
              },
            }),
          ]
        `,
      }),
    ],
    saveOnInvalidExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          onSubmission: [
            submitTransition({
              validate: true,
              onValid: {
                effects: [MyFormEffects.saveAnswers()],
                next: [next({ goto: '/next-step' })],
              },
              onInvalid: {
                // Save as draft even when invalid
                effects: [MyFormEffects.saveDraft()],
                // No 'next' - stay on page with errors
              },
            }),
          ]
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/format-value',
          labelText: 'Format a Dynamic Value',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/dynamic-options',
          labelText: 'Dynamic Dropdown Options',
        },
      }),
    ],
  },
})
