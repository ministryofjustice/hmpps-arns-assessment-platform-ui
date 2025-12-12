import { step, block, Answer, field, when, Conditional, submitTransition } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination, GovUKRadioInput, GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { exampleBox } from '../../helpers/exampleBox'

/**
 * Expressions - Conditional
 *
 * Documentation for when() and Conditional() if/then/else expressions.
 */
export const conditionalStep = step({
  path: '/conditional',
  title: 'Conditional Expressions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Conditional Expressions</h1>

        <p class="govuk-body-l">
          Conditional expressions return different values based on a predicate.
          The form-engine provides two equivalent APIs: <code>when()</code> for fluent
          chaining and <code>Conditional()</code> for object syntax.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Two Equivalent APIs</h2>

        <p class="govuk-body">
          Both APIs produce the same result. Choose based on readability:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { when, Conditional, Answer, Condition } from '@form-engine/form/builders'

// Fluent API: when().then().else()
when(Answer('country').match(Condition.Equals('UK')))
  .then('Postcode')
  .else('ZIP Code')

// Object API: Conditional({ when, then, else })
Conditional({
  when: Answer('country').match(Condition.Equals('UK')),
  then: 'Postcode',
  else: 'ZIP Code',
})

// Both produce the same result!`,
    }),

    // when() builder
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">when() - Fluent Builder</h2>

        <p class="govuk-body">
          The <code>when()</code> function starts a fluent chain:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Basic structure
when(predicate)
  .then(valueIfTrue)
  .else(valueIfFalse)

// Examples
when(Answer('age').match(Condition.Number.GreaterThan(18)))
  .then('Adult')
  .else('Minor')

when(Answer('hasAccount').match(Condition.Equals(true)))
  .then('Welcome back!')
  .else('Create an account to continue')

// else is optional (returns undefined when false)
when(Answer('isPremium').match(Condition.Equals(true)))
  .then('Premium features enabled')`,
    }),

    // Conditional() object
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional() - Object Syntax</h2>

        <p class="govuk-body">
          The <code>Conditional()</code> function takes an options object:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Basic structure
Conditional({
  when: predicate,
  then: valueIfTrue,
  else: valueIfFalse,  // optional
})

// Examples
Conditional({
  when: Answer('membershipType').match(Condition.Equals('gold')),
  then: 'Gold member discount: 20%',
  else: 'Standard pricing',
})

// Without else
Conditional({
  when: Answer('showBanner').match(Condition.Equals(true)),
  then: '<div class="banner">Special offer!</div>',
})`,
    }),

    // Live example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Live Example</h2>
        <p class="govuk-body">
          Select a country to see the label change dynamically:
        </p>
      `,
    }),

    exampleBox([
      field<GovUKRadioInput>({
        variant: 'govukRadioInput',
        code: 'conditionalExampleCountry',
        fieldset: {
          legend: { text: 'Where do you live?' },
        },
        items: [
          { value: 'UK', text: 'United Kingdom' },
          { value: 'US', text: 'United States' },
          { value: 'other', text: 'Other' },
        ],
      }),

      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'conditionalExamplePostcode',
        label: when(Answer('conditionalExampleCountry').match(Condition.Equals('US')))
          .then('ZIP Code')
          .else('Postcode'),
        hint: Conditional({
          when: Answer('conditionalExampleCountry').match(Condition.Equals('US')),
          then: 'For example, 90210',
          else: 'For example, SW1A 1AA',
        }),
        hidden: Answer('conditionalExampleCountry').not.match(Condition.IsRequired()),
      }),
    ]),

    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <p class="govuk-body govuk-!-margin-top-4">The code for this example:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'conditionalExampleCountry',
  fieldset: { legend: { text: 'Where do you live?' } },
  items: [
    { value: 'UK', text: 'United Kingdom' },
    { value: 'US', text: 'United States' },
    { value: 'other', text: 'Other' },
  ],
})

field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'conditionalExamplePostcode',

  // Dynamic label using when()
  label: when(Answer('conditionalExampleCountry').match(Condition.Equals('US')))
    .then('ZIP Code')
    .else('Postcode'),

  // Dynamic hint using Conditional()
  hint: Conditional({
    when: Answer('conditionalExampleCountry').match(Condition.Equals('US')),
    then: 'For example, 90210',
    else: 'For example, SW1A 1AA',
  }),

  // Only show when country is selected
  hidden: Answer('conditionalExampleCountry').not.match(Condition.IsRequired()),
})`,
          }),
        ],
      },
    }),

    // Nested conditionals
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Nested Conditionals</h2>

        <p class="govuk-body">
          For multiple conditions, nest conditionals in the <code>else</code> branch:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Using when() - fluent nesting
when(Answer('tier').match(Condition.Equals('premium')))
  .then('Premium Support (24/7)')
  .else(
    when(Answer('tier').match(Condition.Equals('standard')))
      .then('Standard Support (9-5)')
      .else('Basic Support (email only)')
  )

// Using Conditional() - object nesting
Conditional({
  when: Answer('tier').match(Condition.Equals('premium')),
  then: 'Premium Support (24/7)',
  else: Conditional({
    when: Answer('tier').match(Condition.Equals('standard')),
    then: 'Standard Support (9-5)',
    else: 'Basic Support (email only)',
  }),
})

// Three-level nesting
Conditional({
  when: Answer('score').match(Condition.Number.GreaterThan(90)),
  then: 'A',
  else: Conditional({
    when: Answer('score').match(Condition.Number.GreaterThan(80)),
    then: 'B',
    else: Conditional({
      when: Answer('score').match(Condition.Number.GreaterThan(70)),
      then: 'C',
      else: 'D',
    }),
  }),
})`,
    }),

    // Choosing between APIs
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Choosing Between APIs</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Use Case</th>
              <th scope="col" class="govuk-table__header">Recommended</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Simple conditionals</td>
              <td class="govuk-table__cell">Either &mdash; personal preference</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Inline in properties</td>
              <td class="govuk-table__cell"><code>when()</code> &mdash; more concise</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Deeply nested logic</td>
              <td class="govuk-table__cell"><code>Conditional()</code> &mdash; clearer structure</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Complex predicates</td>
              <td class="govuk-table__cell"><code>Conditional()</code> &mdash; easier to read</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Common use cases
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Use Cases</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// 1. Dynamic field labels
field<GovUKTextInput>({
  code: 'identifier',
  label: when(Answer('idType').match(Condition.Equals('email')))
    .then('Email address')
    .else('Phone number'),
})

// 2. Conditional content blocks
block<HtmlBlock>({
  variant: 'html',
  content: when(Answer('formComplete').match(Condition.Equals(true)))
    .then('<div class="govuk-panel govuk-panel--confirmation">Complete!</div>')
    .else('<p>Please complete all required fields.</p>'),
})

// 3. Dynamic validation messages
validation({
  when: Self().not.match(Condition.IsRequired()),
  message: Conditional({
    when: Answer('fieldType').match(Condition.Equals('email')),
    then: 'Enter your email address',
    else: 'Enter your phone number',
  }),
})

// 4. Conditional default values
field<GovUKTextInput>({
  code: 'country',
  defaultValue: Conditional({
    when: Data('user.location').match(Condition.Equals('GB')),
    then: 'United Kingdom',
    else: Data('user.location'),
  }),
})

// 5. Dynamic HTML content
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<p>Status: %1</p>',
    when(Answer('approved').match(Condition.Equals(true)))
      .then('<strong class="govuk-tag govuk-tag--green">Approved</strong>')
      .else('<strong class="govuk-tag govuk-tag--red">Pending</strong>')
  ),
})`,
    }),

    // Values can be expressions
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Values Can Be Expressions</h2>

        <p class="govuk-body">
          The <code>then</code> and <code>else</code> values can be any expression,
          not just strings:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Reference values
Conditional({
  when: Answer('useBusinessAddress').match(Condition.Equals(true)),
  then: Data('business.address'),      // Return reference value
  else: Answer('homeAddress'),          // Return another reference
})

// Format expressions
when(Answer('hasTitle').match(Condition.Equals(true)))
  .then(Format('%1 %2', Answer('title'), Answer('name')))
  .else(Answer('name'))

// Nested conditionals as values
Conditional({
  when: Answer('country').match(Condition.Equals('UK')),
  then: 'British Pound (£)',
  else: Conditional({
    when: Answer('country').match(Condition.Equals('US')),
    then: 'US Dollar ($)',
    else: 'Euro (€)',
  }),
})`,
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
              href: '/forms/form-engine-developer-guide/expressions/format',
              labelText: 'Format Expressions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/predicates',
              labelText: 'Predicate Combinators',
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
