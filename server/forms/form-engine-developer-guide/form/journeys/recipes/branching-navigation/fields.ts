import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Branching Navigation
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Branching Navigation

Navigate to different steps based on user answers. {.lead}

---

## The Pattern

Use multiple \`redirect()\` calls with \`when\` conditions in your
\`submitTransition\`. The first matching condition wins.

{{slot:basicExample}}

---

## How It Works

1. \`next\` takes an array of navigation options
2. Each \`redirect()\` can have a \`when\` condition
3. First matching condition is used
4. Always include a fallback (no \`when\`) as the last option

---

## Key Rule: First Match Wins

The engine checks conditions **in order** and uses the first match.
Always order from most specific to least specific:

1. Specific conditions first
2. Fallback (no \`when\`) last

---

## Common Variations

### Multiple branches

{{slot:multipleBranchesExample}}

### Skip a step conditionally

{{slot:skipExample}}

### Branch based on multiple conditions

{{slot:multiConditionExample}}

### Return to hub vs continue

{{slot:hubExample}}

---

## Related Concepts

- [Transitions](/forms/form-engine-developer-guide/transitions/navigation) - Full navigation documentation
- [Conditions](/forms/form-engine-developer-guide/conditions/intro) - Available condition types
- [References](/forms/form-engine-developer-guide/references/answer) - Using Answer() in conditions

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { step, submitTransition, redirect, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'

          export const userTypeStep = step({
            path: '/user-type',
            title: 'What type of user are you?',
            blocks: [/* radio field with 'business' or 'individual' */],

            onSubmission: [
              submitTransition({
                validate: true,
                onValid: {
                  next: [
                    // Business users go to business details
                    redirect({
                      when: Answer('userType').match(Condition.Equals('business')),
                      goto: '/business-details',
                    }),
                    // Individual users go to personal details
                    redirect({
                      when: Answer('userType').match(Condition.Equals('individual')),
                      goto: '/personal-details',
                    }),
                    // Fallback (always include one!)
                    redirect({ goto: '/generic-details' }),
                  ],
                },
              }),
            ],
          })
        `,
      }),
    ],
    multipleBranchesExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          onValid: {
            next: [
              redirect({
                when: Answer('country').match(Condition.Equals('UK')),
                goto: '/uk-address',
              }),
              redirect({
                when: Answer('country').match(Condition.Equals('US')),
                goto: '/us-address',
              }),
              redirect({
                when: Answer('country').match(Condition.Equals('CA')),
                goto: '/ca-address',
              }),
              // All other countries
              redirect({ goto: '/international-address' }),
            ],
          }
        `,
      }),
    ],
    skipExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Skip the address step if user says "no fixed address"
          onValid: {
            next: [
              redirect({
                when: Answer('hasAddress').match(Condition.Equals('no')),
                goto: '/contact-details',  // Skip address step
              }),
              redirect({ goto: '/address' }),  // Normal flow
            ],
          }
        `,
      }),
    ],
    multiConditionExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { and } from '@form-engine/form/builders'

          onValid: {
            next: [
              // Premium business users get special flow
              redirect({
                when: and(
                  Answer('userType').match(Condition.Equals('business')),
                  Answer('tier').match(Condition.Equals('premium'))
                ),
                goto: '/premium-onboarding',
              }),
              // Other business users
              redirect({
                when: Answer('userType').match(Condition.Equals('business')),
                goto: '/business-onboarding',
              }),
              // Everyone else
              redirect({ goto: '/standard-onboarding' }),
            ],
          }
        `,
      }),
    ],
    hubExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Different buttons for different destinations
          onSubmission: [
            // "Save and return to hub" button
            submitTransition({
              when: Post('action').match(Condition.Equals('saveAndReturn')),
              validate: true,
              onValid: {
                effects: [MyEffects.saveAnswers()],
                next: [redirect({ goto: '/hub' })],
              },
            }),

            // "Save and continue" button
            submitTransition({
              when: Post('action').match(Condition.Equals('continue')),
              validate: true,
              onValid: {
                effects: [MyEffects.saveAnswers()],
                next: [redirect({ goto: '/next-step' })],
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
          href: '/forms/form-engine-developer-guide/recipes/dynamic-options',
          labelText: 'Dynamic Dropdown Options',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/action-lookup',
          labelText: 'In-Page Lookup',
        },
      }),
    ],
  },
})
