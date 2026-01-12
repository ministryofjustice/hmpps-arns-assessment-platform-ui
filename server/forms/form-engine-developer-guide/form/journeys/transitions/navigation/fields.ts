import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Navigation
 *
 * The next() builder and navigation patterns.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Navigation

  The \`next()\` builder defines where users go after transitions.
  Used in \`onSubmission\` and \`redirect\` arrays. {.lead}

  ---

  ## Interface

  <h3 class="govuk-heading-s"><code>when</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Condition for this navigation to apply. If omitted, always matches (use as fallback).
  In arrays, the first \`next()\` with a matching \`when\` is used.

  {{slot:whenCode}}

  <h3 class="govuk-heading-s"><code>goto</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  Destination path. Can be a string (relative or absolute) or a \`Format()\`
  expression for dynamic paths. Does **not** accept \`Conditional()\`
  or \`when().then()\`.

  {{slot:gotoCode}}

  ---

  ## Static Navigation

  The simplest form — navigate to a fixed path:

  {{slot:staticNavCode}}

  ---

  ## Dynamic Paths with Format()

  Use \`Format()\` to build paths dynamically from answers or parameters:

  {{slot:dynamicPathCode}}

  ---

  ## Conditional Navigation

  Use \`when\` to navigate to different destinations based on answers:

  {{slot:conditionalNavCode}}

  ---

  ## First-Match Semantics

  Navigation arrays use **first-match** semantics:

  1. Each \`next()\` is evaluated in order
  2. The first one where \`when\` matches (or has no \`when\`) is used
  3. Remaining entries are ignored

  <div class="govuk-inset-text">
    Always put specific conditions first and a fallback (no <code>when</code>) last.
  </div>

  ---

  ## Staying on Current Step

  To stay on the current step, **omit the \`next\` array entirely**:

  {{slot:stayOnStepCode}}

  ---

  ## Redirect Arrays

  In \`accessTransition\`, use \`redirect\` instead of \`next\`.
  It works the same way:

  {{slot:redirectCode}}

  ---

  ## What \`goto\` Accepts

  | Type | Example | Use Case |
  |------|---------|----------|
  | String (relative) | \`'next-step'\` | Navigate within current journey |
  | String (absolute) | \`'/other/path'\` | Navigate to different journey |
  | Format() | \`Format('/items/%1', id)\` | Dynamic path with values |

  <div class="govuk-warning-text">
    <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
    <strong class="govuk-warning-text__text">
      <span class="govuk-visually-hidden">Warning</span>
      <code>goto</code> only accepts strings or <code>Format()</code> expressions.
      It does not accept <code>Conditional()</code> or <code>when().then().else()</code>.
    </strong>
  </div>

  ---

  ## Common Pattern: Branch and Merge

  A typical flow where users take different paths then converge:

  {{slot:branchMergeCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    whenCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          next({
            when: Answer('hasChildren').match(Condition.Equals('yes')),
            goto: '/children-details',
          })
        `,
      }),
    ],
    gotoCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Relative path (within current journey)
          goto: 'next-step'

          // Absolute path
          goto: '/other-journey/step'

          // Dynamic path with Format()
          goto: Format('/items/%1/edit', Answer('itemId'))
        `,
      }),
    ],
    staticNavCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Relative path (within current journey)
          next({ goto: 'next-step' })

          // Absolute path
          next({ goto: '/some-other-journey/step' })
        `,
      }),
    ],
    dynamicPathCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Navigate to edit page for specific item
          next({ goto: Format('/items/%1/edit', Answer('selectedItemId')) })

          // Use URL parameter
          next({ goto: Format('/assessments/%1/summary', Params('assessmentId')) })

          // Combine multiple values
          next({ goto: Format('/users/%1/orders/%2', Answer('userId'), Answer('orderId')) })
        `,
      }),
    ],
    conditionalNavCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          onValid: {
            effects: [MyEffects.saveAnswers()],
            next: [
              // Check conditions in order
              next({
                when: Answer('hasChildren').match(Condition.Equals('yes')),
                goto: '/children-details',
              }),
              next({
                when: Answer('hasPartner').match(Condition.Equals('yes')),
                goto: '/partner-details',
              }),
              // Fallback - always include one without 'when'
              next({ goto: '/summary' }),
            ],
          }
        `,
      }),
    ],
    stayOnStepCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Stay on step after invalid submission
          onSubmission: [
            submitTransition({
              validate: true,
              onValid: {
                effects: [MyEffects.saveAnswers()],
                next: [next({ goto: '/next-step' })],
              },
              // No onInvalid - stays on current step with errors
            }),
          ],

          // Stay on step after adding to collection
          onSubmission: [
            submitTransition({
              when: Post('action').match(Condition.Equals('addItem')),
              validate: false,
              onAlways: {
                effects: [MyEffects.addItem()],
                // No next - stays on step to show updated list
              },
            }),
          ],
        `,
      }),
    ],
    redirectCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              guards: Data('user.isAuthenticated').match(Condition.Equals(true)),
              // redirect is always an array, even for single destination
              redirect: [next({ goto: '/login' })],
            }),
          ],

          // Conditional redirect based on reason
          onAccess: [
            accessTransition({
              guards: Data('assessment.status').match(Condition.Equals('active')),
              redirect: [
                next({
                  when: Data('assessment.status').match(Condition.Equals('completed')),
                  goto: '/assessment-complete',
                }),
                next({
                  when: Data('assessment.status').match(Condition.Equals('cancelled')),
                  goto: '/assessment-cancelled',
                }),
                next({ goto: '/assessments' }),
              ],
            }),
          ],
        `,
      }),
    ],
    branchMergeCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Step 1: Choose path
          // /choose-type
          onSubmission: [
            submitTransition({
              validate: true,
              onValid: {
                next: [
                  next({
                    when: Answer('type').match(Condition.Equals('business')),
                    goto: '/business-details',  // Branch A
                  }),
                  next({ goto: '/individual-details' }),  // Branch B
                ],
              },
            }),
          ],

          // Branch A: /business-details
          onSubmission: [
            submitTransition({
              validate: true,
              onValid: {
                next: [next({ goto: '/summary' })],  // Merge
              },
            }),
          ],

          // Branch B: /individual-details
          onSubmission: [
            submitTransition({
              validate: true,
              onValid: {
                next: [next({ goto: '/summary' })],  // Merge
              },
            }),
          ],
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transitions/submit',
          labelText: 'Submit Transitions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/components/intro',
          labelText: 'Components',
        },
      }),
    ],
  },
})
