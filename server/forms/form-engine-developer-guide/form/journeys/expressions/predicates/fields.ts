import { and, Answer, not } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKPagination, GovUKRadioInput } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { exampleBox } from '../../../../helpers/exampleBox'

/**
 * Expressions - Predicate Combinators
 *
 * Documentation for and(), or(), xor(), not() boolean combinators.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Predicate Combinators

  Predicate combinators combine multiple conditions into complex boolean
  expressions. Use them when a single \`.match()\` isn't enough. {.lead}

  ---

  ## The Four Combinators

  | Combinator | Returns true when... | Logic |
  |------------|---------------------|-------|
  | \`and(a, b, ...)\` | All predicates are true | a AND b AND ... |
  | \`or(a, b, ...)\` | At least one is true | a OR b OR ... |
  | \`xor(a, b)\` | Exactly one is true | a XOR b (exclusive or) |
  | \`not(a)\` | Predicate is false | NOT a |

  {{slot:basicCode}}

  ---

  ## and() - All Must Be True

  Use \`and()\` when multiple conditions must all be satisfied:

  {{slot:andCode}}

  ---

  ## or() - At Least One Must Be True

  Use \`or()\` when any one of several conditions is sufficient:

  {{slot:orCode}}

  ---

  ## Live Example - and()

  The second question only appears when the first is "Yes". The confirmation message
  uses \`and()\` to only appear when **both** answers are "Yes".

  {{slot:liveExample}}

  ---

  ## xor() - Exactly One Must Be True

  Use \`xor()\` for mutually exclusive options where exactly one must be selected:

  {{slot:xorCode}}

  ---

  ## not() - Negate a Predicate

  Use \`not()\` to invert any predicate. Note that \`.not.match()\`
  on references achieves the same thing for simple cases:

  {{slot:notCode}}

  ---

  ## Combining Combinators

  Combinators can be nested to create complex logic:

  {{slot:combiningCode}}

  ---

  ## Common Validation Patterns

  {{slot:validationCode}}

  ---

  ## Quick Reference

  | Pattern | Meaning |
  |---------|---------|
  | \`and(A, B)\` | Both A and B must be true |
  | \`or(A, B)\` | A or B (or both) must be true |
  | \`xor(A, B)\` | Exactly one of A or B must be true |
  | \`not(A)\` | A must be false |
  | \`and(A, B).not\` | NOT (A and B) - at least one is false |
  | \`or(A, B).not\` | NOT (A or B) - both are false |

  ---

  {{slot:pagination}}
`),
  slots: {
    basicCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { and, or, xor, not, Answer, Condition } from '@form-engine/form/builders'

          // All must be true
          and(
            Answer('age').match(Condition.Number.GreaterThan(18)),
            Answer('hasConsent').match(Condition.Equals(true))
          )

          // At least one must be true
          or(
            Answer('role').match(Condition.Equals('admin')),
            Answer('role').match(Condition.Equals('manager'))
          )

          // Exactly one must be true
          xor(
            Answer('optionA').match(Condition.Equals(true)),
            Answer('optionB').match(Condition.Equals(true))
          )

          // Invert a predicate
          not(Answer('isBlocked').match(Condition.Equals(true)))
        `,
      }),
    ],
    andCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Validation depends on another field
          validation({
            when: and(
              Answer('hasHygieneRating').match(Condition.Equals('yes')),
              Self().not.match(Condition.IsRequired())
            ),
            message: 'Select your food hygiene rating',
          })

          // Show field only when multiple conditions met
          GovUKTextInput({
            code: 'spouseDetails',
            hidden: and(
              Answer('maritalStatus').match(Condition.Equals('married')),
              Answer('includeSpouse').match(Condition.Equals(true))
            ).not,  // hidden when NOT (married AND includeSpouse)
          })

          // Complex validation rule
          validation({
            when: and(
              Answer('country').match(Condition.Equals('UK')),
              Self().not.match(Condition.Address.IsValidPostcode())
            ),
            message: 'Enter a valid UK postcode',
          })
        `,
      }),
    ],
    orCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Show field for multiple roles
          GovUKTextInput({
            code: 'adminNotes',
            hidden: or(
              Answer('role').match(Condition.Equals('admin')),
              Answer('role').match(Condition.Equals('manager')),
              Answer('role').match(Condition.Equals('supervisor'))
            ).not,  // hidden when NOT (admin OR manager OR supervisor)
          })

          // Accept multiple valid formats
          validation({
            when: or(
              Self().match(Condition.String.MatchesRegex('^[0-9]{5}$')),      // 5 digits
              Self().match(Condition.String.MatchesRegex('^[0-9]{5}-[0-9]{4}$'))  // ZIP+4
            ).not,
            message: 'Enter a valid ZIP code (12345 or 12345-6789)',
          })

          // Multiple trigger conditions
          HtmlBlock({
            content: '<div class="warning">Action required</div>',
            hidden: or(
              Answer('status').match(Condition.Equals('overdue')),
              Answer('status').match(Condition.Equals('urgent'))
            ).not,
          })
        `,
      }),
    ],
    liveExample: [
      exampleBox([
        GovUKRadioInput({
          code: 'predicateHasIssue',
          fieldset: {
            legend: { text: 'Did you experience any issues?' },
          },
          items: [
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' },
          ],
        }),

        GovUKRadioInput({
          code: 'predicateWantsFollowup',
          fieldset: {
            legend: { text: 'Would you like us to follow up?' },
          },
          items: [
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' },
          ],
          hidden: Answer('predicateHasIssue').not.match(Condition.Equals('yes')),
        }),

        HtmlBlock({
          content: `
            <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>This message uses <code>and()</code></strong> — it only appears
              when both answers are "Yes". We'll be in touch soon!
            </div>
          `,
          hidden: not(
            and(
              Answer('predicateHasIssue').match(Condition.Equals('yes')),
              Answer('predicateWantsFollowup').match(Condition.Equals('yes')),
            ),
          ),
        }),
      ]),
    ],
    xorCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Ensure exactly one contact method is provided
          validation({
            when: xor(
              Answer('email').match(Condition.IsRequired()),
              Answer('phone').match(Condition.IsRequired())
            ).not,
            message: 'Provide either email or phone, but not both',
          })

          // Validate exclusive checkboxes
          validation({
            when: xor(
              Answer('optionA').match(Condition.Equals(true)),
              Answer('optionB').match(Condition.Equals(true))
            ).not,
            message: 'Select exactly one option',
          })
        `,
      }),
    ],
    notCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Standalone not() function
          not(Answer('isBlocked').match(Condition.Equals(true)))

          // Equivalent using .not.match()
          Answer('isBlocked').not.match(Condition.Equals(true))

          // not() is useful for negating compound predicates
          not(
            and(
              Answer('hasPermission').match(Condition.Equals(true)),
              Answer('isVerified').match(Condition.Equals(true))
            )
          )

          // Show content when user is NOT (admin AND verified)
          // Hidden when IS (admin AND verified) - use and() directly
          HtmlBlock({
            content: '<p>Limited access mode</p>',
            hidden: and(
              Answer('role').match(Condition.Equals('admin')),
              Answer('verified').match(Condition.Equals(true))
            ),
          })
        `,
      }),
    ],
    combiningCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // (A AND B) OR C
          or(
            and(
              Answer('hasAccount').match(Condition.Equals(true)),
              Answer('isVerified').match(Condition.Equals(true))
            ),
            Answer('guestCheckout').match(Condition.Equals(true))
          )

          // A AND (B OR C)
          and(
            Answer('termsAccepted').match(Condition.Equals(true)),
            or(
              Answer('paymentMethod').match(Condition.Equals('card')),
              Answer('paymentMethod').match(Condition.Equals('paypal'))
            )
          )

          // NOT (A OR B)
          not(
            or(
              Answer('status').match(Condition.Equals('blocked')),
              Answer('status').match(Condition.Equals('suspended'))
            )
          )
        `,
      }),
    ],
    validationCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Conditional required field
          // "Required only when other field has specific value"
          validation({
            when: and(
              Answer('contactPreference').match(Condition.Equals('email')),
              Self().not.match(Condition.IsRequired())
            ),
            message: 'Enter your email address',
          })

          // 2. Cross-field validation
          // "End date must be after start date"
          validation({
            when: and(
              Answer('startDate').match(Condition.IsRequired()),
              Self().not.match(Condition.Date.IsAfter(Answer('startDate')))
            ),
            message: 'End date must be after start date',
          })

          // 3. At least one of multiple fields
          // "Provide at least one contact method"
          validation({
            when: or(
              Answer('email').match(Condition.IsRequired()),
              Answer('phone').match(Condition.IsRequired()),
              Answer('address').match(Condition.IsRequired())
            ).not,
            message: 'Provide at least one contact method',
          })

          // 4. Conditional format validation
          // "UK postcode format only for UK addresses"
          validation({
            when: and(
              Answer('country').match(Condition.Equals('UK')),
              Self().match(Condition.IsRequired()),
              Self().not.match(Condition.Address.IsValidPostcode())
            ),
            message: 'Enter a valid UK postcode',
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/expressions/conditional',
          labelText: 'Conditional Expressions',
        },
        next: {
          href: '/form-engine-developer-guide/expressions/playground/intro',
          labelText: 'Expressions Playground',
        },
      }),
    ],
  },
})
