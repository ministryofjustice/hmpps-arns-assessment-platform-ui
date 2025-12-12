import { step, block, Answer, field, submitTransition, and, not } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination, GovUKRadioInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { exampleBox } from '../../helpers/exampleBox'

/**
 * Expressions - Predicate Combinators
 *
 * Documentation for and(), or(), xor(), not() boolean combinators.
 */
export const predicatesStep = step({
  path: '/predicates',
  title: 'Predicate Combinators',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Predicate Combinators</h1>

        <p class="govuk-body-l">
          Predicate combinators combine multiple conditions into complex boolean
          expressions. Use them when a single <code>.match()</code> isn't enough.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Four Combinators</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Combinator</th>
              <th scope="col" class="govuk-table__header">Returns true when...</th>
              <th scope="col" class="govuk-table__header">Logic</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>and(a, b, ...)</code></td>
              <td class="govuk-table__cell">All predicates are true</td>
              <td class="govuk-table__cell">a AND b AND ...</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>or(a, b, ...)</code></td>
              <td class="govuk-table__cell">At least one is true</td>
              <td class="govuk-table__cell">a OR b OR ...</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>xor(a, b)</code></td>
              <td class="govuk-table__cell">Exactly one is true</td>
              <td class="govuk-table__cell">a XOR b (exclusive or)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>not(a)</code></td>
              <td class="govuk-table__cell">Predicate is false</td>
              <td class="govuk-table__cell">NOT a</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
not(Answer('isBlocked').match(Condition.Equals(true)))`,
    }),

    // and()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">and() - All Must Be True</h2>

        <p class="govuk-body">
          Use <code>and()</code> when multiple conditions must all be satisfied:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
field<GovUKTextInput>({
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
})`,
    }),

    // or()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">or() - At Least One Must Be True</h2>

        <p class="govuk-body">
          Use <code>or()</code> when any one of several conditions is sufficient:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Show field for multiple roles
field<GovUKTextInput>({
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
block<HtmlBlock>({
  variant: 'html',
  content: '<div class="warning">Action required</div>',
  hidden: or(
    Answer('status').match(Condition.Equals('overdue')),
    Answer('status').match(Condition.Equals('urgent'))
  ).not,
})`,
    }),

    // Live example - and()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Live Example - and()</h2>
        <p class="govuk-body">
          The second question only appears when the first is "Yes". The confirmation message
          uses <code>and()</code> to only appear when <strong>both</strong> answers are "Yes".
        </p>
      `,
    }),

    exampleBox([
      field<GovUKRadioInput>({
        variant: 'govukRadioInput',
        code: 'predicateHasIssue',
        fieldset: {
          legend: { text: 'Did you experience any issues?' },
        },
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      }),

      field<GovUKRadioInput>({
        variant: 'govukRadioInput',
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

      block<HtmlBlock>({
        variant: 'html',
        content: `
          <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            <strong>This message uses <code>and()</code></strong> &mdash; it only appears
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

    // xor()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">xor() - Exactly One Must Be True</h2>

        <p class="govuk-body">
          Use <code>xor()</code> for mutually exclusive options where exactly one must be selected:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
})`,
    }),

    // not()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">not() - Negate a Predicate</h2>

        <p class="govuk-body">
          Use <code>not()</code> to invert any predicate. Note that <code>.not.match()</code>
          on references achieves the same thing for simple cases:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
block<HtmlBlock>({
  content: '<p>Limited access mode</p>',
  hidden: and(
    Answer('role').match(Condition.Equals('admin')),
    Answer('verified').match(Condition.Equals(true))
  ),
})`,
    }),

    // Combining combinators
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Combining Combinators</h2>

        <p class="govuk-body">
          Combinators can be nested to create complex logic:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
)`,
    }),

    // Common validation patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Validation Patterns</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
})`,
    }),

    // Quick reference
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Quick Reference</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Pattern</th>
              <th scope="col" class="govuk-table__header">Meaning</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>and(A, B)</code></td>
              <td class="govuk-table__cell">Both A and B must be true</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>or(A, B)</code></td>
              <td class="govuk-table__cell">A or B (or both) must be true</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>xor(A, B)</code></td>
              <td class="govuk-table__cell">Exactly one of A or B must be true</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>not(A)</code></td>
              <td class="govuk-table__cell">A must be false</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>and(A, B).not</code></td>
              <td class="govuk-table__cell">NOT (A and B) - at least one is false</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>or(A, B).not</code></td>
              <td class="govuk-table__cell">NOT (A or B) - both are false</td>
            </tr>
          </tbody>
        </table>
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
              href: '/forms/form-engine-developer-guide/expressions/conditional',
              labelText: 'Conditional Expressions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/collection',
              labelText: 'Collection Expressions',
            },
          }),
        ],
      },
    }),
  ],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
