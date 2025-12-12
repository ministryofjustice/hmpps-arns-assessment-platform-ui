import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Expressions - Introduction
 *
 * High-level overview of what expressions are, their purpose, and
 * the different types available in the form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Expressions',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Expressions</h1>

        <p class="govuk-body-l">
          <strong>Expressions</strong> compute values dynamically at runtime.
          They combine references, conditions, and transformations to produce
          text, boolean logic, and complex data structures.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is an Expression?</h2>

        <p class="govuk-body">
          While <strong>references</strong> point to single values, <strong>expressions</strong>
          combine and transform those values into something new. They are the building blocks
          for dynamic form behaviour.
        </p>

        <p class="govuk-body">
          Expressions enable:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>String interpolation with placeholders</li>
          <li>If/then/else conditional logic</li>
          <li>Boolean combinations (AND, OR, XOR)</li>
          <li>Iterating over collections</li>
          <li>Transforming values through pipelines</li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Expression Types</h2>

        <p class="govuk-body">
          The form-engine provides four main expression builders:
        </p>
      `,
    }),

    // Expression types table
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Expression</th>
              <th scope="col" class="govuk-table__header">Returns</th>
              <th scope="col" class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Format()</code></td>
              <td class="govuk-table__cell">String</td>
              <td class="govuk-table__cell">String interpolation with placeholders</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>when()</code> / <code>Conditional()</code></td>
              <td class="govuk-table__cell">Any value</td>
              <td class="govuk-table__cell">If/then/else branching logic</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>and()</code>, <code>or()</code>, <code>xor()</code>, <code>not()</code></td>
              <td class="govuk-table__cell">Boolean</td>
              <td class="govuk-table__cell">Combining multiple predicates</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Collection()</code></td>
              <td class="govuk-table__cell">Array of blocks</td>
              <td class="govuk-table__cell">Iterating over data to generate content</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Import statement
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Importing Expression Builders</h2>
        <p class="govuk-body">
          All expression builders are available from the main builders module:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import {
  // String formatting
  Format,

  // Conditional logic
  when, Conditional,

  // Predicate combinators
  and, or, xor, not,

  // Collection iteration
  Collection, Item,

  // References (used within expressions)
  Answer, Data, Self, Params, Query, Post,
} from '@form-engine/form/builders'`,
          }),
        ],
      },
    }),

    // Expressions vs References
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Expressions vs References</h2>

        <p class="govuk-body">
          Understanding the difference:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">References</th>
              <th scope="col" class="govuk-table__header">Expressions</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Point to existing values</td>
              <td class="govuk-table__cell">Compute new values</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Answer('name')</code></td>
              <td class="govuk-table__cell"><code>Format('Hello, %1!', Answer('name'))</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Single data source</td>
              <td class="govuk-table__cell">Combine multiple sources</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">No logic</td>
              <td class="govuk-table__cell">Conditional branching, iteration</td>
            </tr>
          </tbody>
        </table>

        <div class="govuk-inset-text">
          <strong>Key insight:</strong> Expressions often contain references.
          A <code>Format()</code> expression interpolates reference values.
          A <code>Conditional()</code> branches based on a reference comparison.
        </div>
      `,
    }),

    // Quick examples
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Quick Examples</h2>
        <p class="govuk-body">
          Here's a taste of what each expression type can do:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Format() - String interpolation
Format('Welcome, %1 %2!', Answer('firstName'), Answer('lastName'))
// → "Welcome, John Smith!"

// when() - Conditional branching
when(Answer('age').match(Condition.Number.GreaterThan(18)))
  .then('Adult pricing')
  .else('Child pricing')

// Conditional() - Same thing, object syntax
Conditional({
  when: Answer('country').match(Condition.Equals('UK')),
  then: 'Postcode',
  else: 'ZIP Code',
})

// and() - Both conditions must be true
and(
  Answer('hasAccount').match(Condition.Equals(true)),
  Answer('isVerified').match(Condition.Equals(true))
)

// Collection() - Iterate over array
Collection({
  collection: Data('items'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format('<li>%1</li>', Item().path('name')),
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Where expressions are used
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Where Expressions Are Used</h2>

        <p class="govuk-body">
          Expressions can be used in most field and block properties:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Property</th>
              <th scope="col" class="govuk-table__header">Expression Types</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>content</code></td>
              <td class="govuk-table__cell">Format, Conditional, references</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>label</code>, <code>hint</code></td>
              <td class="govuk-table__cell">Format, Conditional, references</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>hidden</code>, <code>dependent</code></td>
              <td class="govuk-table__cell">Predicates (and, or, xor, .match())</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>when</code> (validation)</td>
              <td class="govuk-table__cell">Predicates</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>defaultValue</code></td>
              <td class="govuk-table__cell">Conditional, references</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>collection</code></td>
              <td class="govuk-table__cell">Collection()</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // What's next
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">What's Next</h2>

        <p class="govuk-body">
          The following pages cover each expression type in detail:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><strong>Format()</strong> &mdash; String interpolation with placeholders</li>
          <li><strong>Conditional Expressions</strong> &mdash; If/then/else with when() and Conditional()</li>
          <li><strong>Predicate Combinators</strong> &mdash; Combining conditions with and(), or(), xor(), not()</li>
          <li><strong>Collection()</strong> &mdash; Iterating over arrays to generate content</li>
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
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/format',
              labelText: 'Format Expressions',
            },
          }),
        ],
      },
    }),
  ],
})
